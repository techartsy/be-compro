const { Portofolio } = require("../../models/");
const except = ["createdAt", "updatedAt"];
const cloudinary = require("../middlewares/cloudinary");

//=Get All Portofolio=\\
exports.portofolios = async (req, res) => {
  try {
    let allPortofolios = await Portofolio.findAll({
      attributes: {
        exclude: except,
      },
    });

    res.status(200).send({
      status: "Success",
      data: {
        portofolio: allPortofolios,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

//=Get Portofolio by id=\\
exports.portofolioId = async (req, res) => {
  try {
    const { id } = req.params;
    let portofolio = await Portofolio.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: except,
      },
    });
    if (!portofolio) {
      return res.status(404).send({
        status: "Failed",
        message: `Portofolio with id ${id} in Table not Found`,
      });
    }
    res.status(200).send({
      status: "Success",
      data: {
        portofolio,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

//=Get Portofolio by category=\\
exports.categoryPortofolio = async (req, res) => {
  try {
    const { category } = req.params;
    let portofolios = await Portofolio.findAll({
      where: {
        category: category,
      },
      attributes: {
        exclude: except,
      },
    });
    if (!portofolios) {
      return res.status(404).send({
        status: "Failed",
        message: `Category ${category} not Found`,
      });
    }
    res.status(200).send({
      status: "Success",
      data: {
        portofolios,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

//=add Portofolio=\\ TOKEN
exports.addPortofolio = async (req, res) => {
  try {
    let data = req.body;
    let portofolio = {
      ...data,
    };
    let withFiles = {
      ...data,
    };

    if (req.files) {
      for (const item of req.files) {
        const { path } = item;
        const newPath = await cloudinary.uploader.upload(path);
        withFiles = {
          ...withFiles,
          [item.fieldname]: newPath.secure_url,
        };
      }
      if (withFiles.thumbnail && withFiles.mainimage && withFiles.secondimage) {
        await Portofolio.create(withFiles);
        res.status(201).send({
          status: "Success",
          data: {
            portofolio: {
              ...withFiles,
            },
          },
        });
      }
    } else {
      await Portofolio.create(portofolio);
      res.status(201).send({
        status: "Success",
        data: {
          portofolio: {
            ...portofolio,
          },
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

//=edit Portofolio=\\ TOKEN
exports.editPortofolio = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    let portofolioCheck = await Portofolio.findOne({
      where: { id },
    });

    if (!portofolioCheck) {
      return res.status(404).send({
        status: "Failed",
        message: `Portofolio with id ${id} not Found`,
      });
    }
    let dataUpdate = {
      ...body,
    };
    if (req.files) {
      for (const item of req.files) {
        const { path } = item;
        const newPath = await cloudinary.uploader.upload(path);
        dataUpdate = {
          ...dataUpdate,
          [item.fieldname]: newPath.secure_url,
        };
      }
    } else {
      dataUpdate = {
        ...body,
      };
    }
    await Portofolio.update(dataUpdate, {
      where: {
        id,
      },
    });
    const portofolioUpdate = await Portofolio.findOne({
      attributes: {
        exclude: except,
      },
      where: {
        id,
      },
    });

    res.status(201).send({
      status: "Success",
      portofolio: {
        id: portofolioUpdate.id,
        mainimage: portofolioUpdate.mainimage,
        secondimage: portofolioUpdate.secondimage,
        title: portofolioUpdate.title,
        description: portofolioUpdate.description,
        category: portofolioUpdate.category,
        thumbnail: portofolioUpdate.thumbnail,
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

//=delete Portofolio=\\ TOKEN
exports.deletePortofolio = async (req, res) => {
  try {
    const { id } = req.params;
    const portofolio = await Portofolio.findOne({
      where: { id },
      attributes: {
        exclude: except,
      },
    });

    if (!portofolio) {
      return res.status(404).send({
        status: "Failed",
        message: `Portofolio with id ${id} not Found`,
        data: [],
      });
    }
    await Portofolio.destroy({ where: { id } });

    res.status(200).send({
      status: "Success",
      data: {
        id,
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "Failed",
      message: "Interna; Server Error",
    });
  }
};
