import express from 'express';
const router = express.Router();

// Define the upload route
router.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const uploadedFile = req.files.file;

    uploadedFile.mv(`uploads/${uploadedFile.name}`, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).send({
            message: 'File uploaded successfully',
            file: uploadedFile.name,
        });
    });
});

export default router;