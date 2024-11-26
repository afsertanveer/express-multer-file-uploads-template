const express = require("express");
const multer = require("multer");
const path = require("path");

// File upload folder
const UPLOADS_FOLDER = "./uploads/";

// Define the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();
    cb(null, fileName + fileExt);
  },
});

// Prepare multer upload object
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, // Limit file size to 1MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "avatar") {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Only JPG, JPEG, PNG allowed"), false);
      }
    } else if (file.fieldname === "doc") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Only PDF files allowed"), false);
      }
    } else {
      cb(new Error("Unknown field"), false);
    }
  },
});

const app = express();

// Single field single file
// app.post("/", upload.single("avatar"), (req, res) => {
//   res.send("File uploaded successfully");
// });

app.post(
  "/",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "doc",
      maxCount: 1,
    },
  ]),
  (req, res) => {
    res.send("Files uploaded successfully");
  }
);

// Single field multiple files
// app.post("/", upload.array("avatar", 3), (req, res) => {
//   res.send("Files uploaded successfully");
// });

// Multiple fields uploads
// app.post(
//   "/",
//   upload.fields([
//     {
//       name: "avatar",
//       maxCount: 1,
//     },
//     {
//       name: "gallery",
//       maxCount: 10,
//     },
//   ]),
//   (req, res) => {
//     res.send("Files uploaded successfully");
//   }
// );

// Form-data with no file uploads
// app.post("/", upload.none(), (req, res) => {
//   res.send("Form data received without files");
// });

// Error handling middleware
app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).send("Multer Error: " + err.message);
    } else {
      res.status(500).send("Error: " + err.message);
    }
  } else {
    next();
  }
});

app.listen(5011, () => {
  console.log("Server running on port 5011");
});
