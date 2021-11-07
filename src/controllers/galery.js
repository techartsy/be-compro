const { Gallery } = require("../../models");
const except = ["createdAt", "updatedAt"];
const cloudinary = require("../middlewares/cloudinary");

//=Get All Gallery=\\
exports.galleries = async (req, res) => {
  try {
    let allItems = await Gallery.findAll({
      attributes: {
        exclude: except,
      },
    });
    res.status(200).send({
      status: "Success",
      data: {
        gallery: allItems,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

//=Get Gallery by id=\\
exports.galleryId = async (req, res) => {
  try {
    const { id } = req.params;
    let galleries = await Gallery.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: except,
      },
    });

    if (!galleries) {
      return res.status(404).send({
        status: "Failed",
        message: `Item with id ${id} in Gallery not found`,
      });
    }
    res.status(200).send({
      status: "Success",
      data: {
        galleries,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

//=Get Item Gallery by Category=\\
exports.galleryCategory = async (req, res) => {
  try {
    const { category } = req.params;
    let galleries = await Gallery.findAll({
      where: {
        category: category,
      },
      attributes: {
        exclude: except,
      },
    });
    if (!galleries) {
      return res.status(404).send({
        status: "Failed",
        message: `Category ${category} not Found`,
      });
    }
    res.status(200).send({
      status: "Success",
      data: {
        galleries,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

//=add Gallery=\\
exports.addItemGallery = async (req, res) => {
  try {
    let data = req.body;
    if (req.file) {
      const uploadedFile = await cloudinary.uploader.upload(req.file.path);
      if (uploadedFile) {
        await Gallery.create({
          ...data,
          image: uploadedFile.secure_url,
        });
        res.status(201).send({
          status: "Success",
          data: {
            gallery: { ...data, image: uploadedFile.secure_url },
          },
        });
      }
    } else {
      await Gallery.create({
        ...data,
      });
      res.status(201).send({
        status: "Success",
        data: {
          gallery: { ...data },
        },
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

//=edit Gallery=\\ TOKEN
exports.editGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    let galleryCheck = await Gallery.findOne({
      where: { id },
    });

    if (!galleryCheck) {
      return res.status(404).send({
        status: "Failed",
        message: `Item with id ${id} not Found`,
      });
    }
    let dataUpdate;
    if (req?.file) {
      const uploadedFile = await cloudinary.uploader.upload(req.file.path);
      dataUpdate = {
        ...body,
        image: uploadedFile.secure_url,
      };
    } else {
      dataUpdate = {
        ...body,
      };
    }
    await Gallery.update(dataUpdate, {
      where: {
        id,
      },
    });

    const galleryUpdate = await Gallery.findOne({
      attributes: {
        exclude: except,
      },
      where: {
        id,
      },
    });

    res.status(201).send({
      status: "Success",
      data: {
        gallery: {
          id: galleryUpdate.id,
          title: galleryUpdate.title,
          image: galleryUpdate.image,
          video: galleryUpdate.video,
          caption: galleryUpdate.caption,
          category: galleryUpdate.category,
        },
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

//=delete Gallery=\\ TOKEN
exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findOne({
      where: { id },
      attributes: {
        exclude: except,
      },
    });

    if (!gallery) {
      return res.status(404).send({
        status: "Failed",
        message: `Item with id ${id} not Found`,
        data: [],
      });
    }
    await Gallery.destroy({
      where: { id },
    });

    res.status(200).send({
      status: "Success",
      data: {
        id,
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};
