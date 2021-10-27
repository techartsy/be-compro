const e = require("express");
const { Layanan } = require("../../models");
const except = ["createdAt", "updatedAt"];
// const joi = require('joi');

//=Get All Layanans=\\
exports.services = async (req, res) => {
  try {
    let allLayanans = await Layanan.findAll({
      attributes: {
        exclude: except,
      },
    });
    allLayanans = JSON.parse(JSON.stringify(allLayanans));
    allLayanans = allLayanans?.map((item) => {
      return {
        ...item,
        image: "https://be-compro.herokuapp.com/uploads/" + item.image,
      }; // sebelum intergrasi ganti link nya
    });

    res.status(200).send({
      status: "Success",
      data: {
        layanan: allLayanans,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

//=Get Layanan by id=\\
exports.getService = async (req, res) => {
  try {
    const { id } = req.params;
    let service = await Layanan.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: except,
      },
    });
    service = JSON.parse(JSON.stringify(service));
    service = {
      ...service,
      image: "https://be-compro.herokuapp.com/uploads/" + service.image, // sebelum intergrasi ganti link nya
    };

    if (!service) {
      return res.status(404).send({
        status: "Failed",
        message: "Layanan not Found",
      });
    }
    res.status(200).send({
      status: "Success",
      data: {
        service,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

//=Get Layanan by Category=\\
exports.getServiceCategory = async (req, res) => {
  try {
    const { category } = req.params;
    let services = await Layanan.findAll({
      where: {
        category: category,
      },
      attributes: {
        exclude: except,
      },
    });
    if (!services) {
      return res.status(404).send({
        status: "Failed",
        message: "Layanan not Found",
      });
    }
    services = JSON.parse(JSON.stringify(services));
    services = services?.map((item) => {
      return {
        ...item,
        image: "https://be-compro.herokuapp.com/uploads/" + item.image,
      }; // sebelum intergrasi ganti link nya
    });
    res.status(200).send({
      status: "Success",
      data: {
        services,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

//=add Layanan=\\ TOKEN
exports.addService = async (req, res) => {
  try {
    let data = req.body;

    if (req.file) {
      await Layanan.create({
        ...data,
        image: req.file.filename,
      });
    }

    res.status(201).send({
      status: "Success",
      data: {
        service: { ...data, image: req.file.filename },
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

//=edit Layanan=\\ TOKEN
exports.editService = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    let serviceCheck = await Layanan.findOne({
      where: { id },
    });

    if (!serviceCheck) {
      return res.status(404).send({
        status: "Failed",
        message: `Layanan with id ${id} not Found`,
      });
    }
    const dataUpdate = {
      ...body,
    };
    if (req.file) {
      dataUpdate = {
        ...body,
        image: req.file.filename,
      };
    }
    await Layanan.update(dataUpdate, {
      where: {
        id,
      },
    });
    const serviceUpdate = await Layanan.findOne({
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
        service: {
          id: serviceUpdate.id,
          image: serviceUpdate.image
            ? "https://be-compro.herokuapp.com/uploads/" + serviceUpdate.image
            : serviceUpdate.image,
          title: serviceUpdate.title,
          description: serviceUpdate.description,
          category: serviceUpdate.category,
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

//=delete Layanan=\\ TOKEN
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Layanan.findOne({
      where: { id },
      attributes: {
        exclude: except,
      },
    });

    if (!product) {
      return res.status(404).send({
        status: "Failed",
        messgae: `Layanan with id ${id} not Found`,
        data: [],
      });
    }
    await Layanan.destroy({ where: { id } });

    res.status(200).send({
      status: "Success",
      data: {
        id,
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "Failed",
      messgae: "Internal Server Error",
    });
  }
};
