const multer = require ("multer");
const path = require("path");

//Story
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, 'uploads');
      // Pastikan direktori uploads ada
      if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

//file filter ony image
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")){
        cb(null, true);
    } else {
        cb(new Error("Only Image Bung"), false);
    }
};

//initiate multer
const upload = multer({storage, fileFilter});

module.exports = upload;