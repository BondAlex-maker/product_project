import db from "../models/index.js";

const Op = db.Sequelize.Op;
const Tutorial = db.tutorials;

const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: tutorials } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, tutorials, totalPages, currentPage };
};

// Create and Save a new Tutorial
export const create = async (req, res) => {
    if (!req.body.title) {
        return res.status(400).send({ message: "Content can not be empty!" });
    }

    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published || false,
    };

    try {
        const data = await Tutorial.create(tutorial);
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while creating the Tutorial." });
    }
};

// Retrieve all Tutorials
export const findAll = async (req, res) => {
    const { page, size, title } = req.query;
    const condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
    const { limit, offset } = getPagination(page, size);

    try {
        const data = await Tutorial.findAndCountAll({ where: condition, limit, offset });
        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving tutorials." });
    }
};

// Find a single Tutorial by ID
export const findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Tutorial.findByPk(id);
        if (data) res.send(data);
        else res.status(404).send({ message: `Cannot find Tutorial with id=${id}.` });
    } catch (err) {
        res.status(500).send({ message: `Error retrieving Tutorial with id=${id}.` });
    }
};

// Update a Tutorial by ID
export const update = async (req, res) => {
    const id = req.params.id;

    try {
        const [num] = await Tutorial.update(req.body, { where: { id } });
        if (num === 1) res.send({ message: "Tutorial was updated successfully." });
        else res.send({ message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!` });
    } catch (err) {
        res.status(500).send({ message: `Error updating Tutorial with id=${id}.` });
    }
};

// Delete a Tutorial by ID
export const deleteOne = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Tutorial.destroy({ where: { id } });
        if (num === 1) res.send({ message: "Tutorial was deleted successfully!" });
        else res.send({ message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!` });
    } catch (err) {
        res.status(500).send({ message: `Could not delete Tutorial with id=${id}.` });
    }
};

// Delete all Tutorials
export const deleteAll = async (req, res) => {
    try {
        const nums = await Tutorial.destroy({ where: {}, truncate: false });
        res.send({ message: `${nums} Tutorials were deleted successfully!` });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while removing all tutorials." });
    }
};

// Find all published Tutorials
export const findAllPublished = async (req, res) => {
    const { page, size, title } = req.query;
    const condition = { published: true };
    const { limit, offset } = getPagination(page, size);
    try {
        const data = await Tutorial.findAndCountAll({ where: condition, limit, offset });
        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving tutorials." });
    }
};
