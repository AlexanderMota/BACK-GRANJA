import multer from "multer";
import path from "path";
import fs from "fs";
/*import path from "path";

const uploadDir = path.join(
    process.cwd(),
    "uploads",
    "avatars"
);*/

const uploadDir = "uploads/avatars";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, uploadDir);

    },

    filename(req, file, cb) {

        const ext = path.extname(file.originalname);

        cb(
            null,
            `${req.user.user_id}-${Date.now()}${ext}`
        );

    }

});

export const uploadAvatar = multer({

    storage,

    limits: {

        fileSize: 5 * 1024 * 1024

    },

    fileFilter(req, file, cb) {

        if (file.mimetype.startsWith("image/")) {

            cb(null, true);

        } else {

            cb(new Error("Solo se permiten imágenes"));

        }

    }

});