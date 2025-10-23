import db from "../models/index.js";

const Op = db.Sequelize.Op;
const Product = db.products;

const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: products } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, products, totalPages, currentPage };
};

// Create and Save a new Product
export const create = async (req, res) => {
    if (!req.body.name) {
        return res.status(400).send({ message: "Product name cannot be empty!" });
    }

    const product = {
        name: req.body.name,
        description: req.body.description,
        ingredients: req.body.ingredients,
        type: req.body.type || "common",
        price: parseFloat(req.body.price),
        sale_price: parseFloat(req.body.sale_price),
        image: req.file ? `uploads/products/${req.file.filename}` : null,
    };

    try {
        const data = await Product.create(product);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Product.",
        });
    }
};

// Retrieve all Products
export const findAll = async (req, res) => {
    const { page, size, name } = req.query;
    const condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
    const { limit, offset } = getPagination(page, size);

    try {
        const data = await Product.findAndCountAll({ where: condition, limit, offset });
        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving products.",
        });
    }
};

// Find a single Product by ID
export const findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Product.findByPk(id);
        if (data) res.send(data);
        else res.status(404).send({ message: `Cannot find Product with id=${id}.` });
    } catch (err) {
        res.status(500).send({ message: `Error retrieving Product with id=${id}.` });
    }
};

// Update a Product by ID
export const update = async (req, res) => {
    const id = req.params.id;

    try {
        // Prepare updated fields (just like in `create`)
        const updatedFields = {
            name: req.body.name,
            description: req.body.description,
            ingredients: req.body.ingredients,
            type: req.body.type || "common",
            price: req.body.price ? parseFloat(req.body.price) : null,
            sale_price: req.body.sale_price ? parseFloat(req.body.sale_price) : null,
        };

        // If a new image was uploaded, update the image path
        if (req.file) {
            updatedFields.image = `uploads/products/${req.file.filename}`;
        }

        // Perform update
        const [num] = await Product.update(updatedFields, { where: { id } });

        if (num === 1) {
            res.send({ message: "Product was updated successfully." });
        } else {
            res.status(404).send({
                message: `Cannot update Product with id=${id}. Maybe Product was not found or request body is empty!`,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Error updating Product with id=${id}.`,
        });
    }
};


// Delete a Product by ID
export const deleteOne = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Product.destroy({ where: { id } });
        if (num === 1) res.send({ message: "Product was deleted successfully!" });
        else res.send({ message: `Cannot delete Product with id=${id}. Maybe Product was not found!` });
    } catch (err) {
        res.status(500).send({ message: `Could not delete Product with id=${id}.` });
    }
};

// Delete all Products
export const deleteAll = async (req, res) => {
    try {
        const nums = await Product.destroy({ where: {}, truncate: false });
        res.send({ message: `${nums} Products were deleted successfully!` });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while removing all products.",
        });
    }
};

const findAllByType = async (req, res, type) => {
    const { page, size, name } = req.query;
    const { limit, offset } = getPagination(page, size);
    const condition = {
        type,
        ...(name ? { name: { [Op.iLike]: `%${name}%` } } : {}),
    };

    try {
        const data = await Product.findAndCountAll({
            where: condition,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });
        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
export const findAllCommon = (req, res) => findAllByType(req, res, "common");
export const findAllAlcohol = (req, res) => findAllByType(req, res, "alcohol");