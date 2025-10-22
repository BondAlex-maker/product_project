import multer from "multer";
import path from "path";
import fs from "fs";

// Папка для сохранения
const uploadDir = path.join(process.cwd(), "app/storage/uploads/products");

// Создаём папку если не существует
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Конфиг multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // чтобы имена не пересекались, добавляем timestamp
        const ext = path.extname(file.originalname);
        const name = file.fieldname + "-" + Date.now() + ext;
        cb(null, name);
    },
});

export const upload = multer({ storage });
