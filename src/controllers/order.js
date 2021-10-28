const { Order } = require("../../models");
const nodemailer = require("nodemailer");
const except = ["createdAt", "updatedAt"];

//=Order Get All=\\
exports.getOrders = async (req, res) => {
  try {
    let allOrders = await Order.findAll({
      attributes: {
        exclude: except,
      },
    });
    res.status(200).send({
      status: "Success",
      allOrders,
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

//=Get Order by id=\\
exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    let order = await Order.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: except,
      },
    });

    if (!order) {
      return res.status(404).send({
        status: "Failed",
        message: "Order not Found",
      });
    }
    res.status(200).send({
      status: "Success",
      data: {
        order,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

//=add Order=\\
exports.addOrder = async (req, res) => {
  try {
    let data = req.body;
    await Order.create({
      ...data,
    });

    let orderData = await Order.findOne({
      where: {
        ...data,
      },
      attributes: {
        exclude: except,
      },
    });

    res.status(201).send({
      status: "Success",
      data: {
        order: orderData,
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "Failed",
      message: "Internal Sevre Error",
    });
  }
};

//=send email=\\
exports.sendEmail = (email) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "techartsy.indonesia@gmail.com",
      pass: "lintingdewe",
    },
  });

  let mailOptions = {
    from: "techartsy.indonesia@gmail.com",
    to: email,
    subject: "email has been delivered",
    text: "email from back end",
    attachments: [
      {
        filename: "QuotationWebDevelopmentTechartsy.pdf",
        path: "./assets/QuotationWebDevelopmentTechartsy.pdf"
      },
      {
        filename: "QuotationCreativeProductionTechartsy.pdf",
        path: "./assets/QuotationCreativeProductionTechartsy.pdf"
      },
    ],
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log(err, "error");
    } else {
      console.log("email sent!");
    }
  });
};

//=edit Order=\\
exports.responseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    let orderCheck = await Order.findOne({ where: { id } });

    if (!orderCheck) {
      return res.status(404).send({
        status: "Failed",
        message: `Order with id ${id} not Found`,
      });
    }
    const dataUpdate = {
      ...body,
    };
    await Order.update(dataUpdate, {
      where: {
        id,
      },
    });

    if (body.status.toLowerCase() === "confirm") {
      this.sendEmail(orderCheck.email);
    }

    res.status(201).send({
      status: "Success",
      data: {
        order: {
          id: dataUpdate.id,
          name: dataUpdate.name,
          email: dataUpdate.email,
          phone: dataUpdate.phone,
          subject: dataUpdate.subject,
          message: dataUpdate.message,
          status: dataUpdate.status,
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

//=delete Order=\\
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      where: { id },
      attributes: except,
    });

    if (!order) {
      return res.status(404).send({
        status: "Failed",
        message: `Order with id ${id} not Found`,
        data: [],
      });
    }
    await Order.destroy({ where: { id } });

    res.status(200).send({
      status: "Success",
      data: {
        id,
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "Failed",
      messsage: "Internal Serve Error",
    });
  }
};
