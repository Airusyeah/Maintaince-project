const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Set up CORS (allows access from other devices)
app.use(cors());

// Serve static files from "uploads" directory
app.use('/files', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

// File listing endpoint
app.get('/files', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    return res.json([]);
  }

  const files = fs.readdirSync(uploadDir).map(file => ({
    name: file,
    url: `http://localhost:${PORT}/files/${file}`,
    date: fs.statSync(path.join(uploadDir, file)).mtime,
  }));

  res.json(files);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
