const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3001;
const uploadPath = "D:\\IIT\\Software Deveoplemt Project\\Full Development\\Dev - Full\\backend\\uploads";

app.use(cors());

app.use(cors({
    origin: 'http://localhost:5173'
}));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

app.use('/uploads', express.static(uploadPath));

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }
    res.status(200).json({
        message: 'Image uploaded successfully',
        filePath: `/uploads/${req.file.filename}`
    });
});

app.delete('/images/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadPath, filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(404).json({ error: 'Image not found or could not be deleted' });
        }
        res.status(200).json({ message: 'Image deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});