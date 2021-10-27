const multer = require("multer");

exports.uploadFile = (imageFile, categoryFile) => {
  const storage = multer.diskStorage({
    destination: function (req, res, cb) {
      cb(null, "app/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, "")}`);
    },
  });

  const fileFilter = function (req, file, cb) {
    if (file.fieldname === imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = {
          message: "Only image filed are allowed!",
        };

        return cb(new Error("only image files are allowed"), false);
      }
    }
    cb(null, true);
  };

  const sizeInMB = 10;
  const maxSize = sizeInMB * 1000 * 1000;

  // generate multer instance for upload

  let upload;
  if (categoryFile === "portofolio") {
    upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: maxSize,
      },
    }).any(imageFile);
  } else if (categoryFile === "layanan") {
    upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: maxSize,
      },
    }).single(imageFile);
  } else {
    upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: maxSize,
      },
    }).single(imageFile);
  }

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max File Size in 10MB",
          });
        }
        return res.status(400).send(err);
      }
      return next();
    });
  };
};
