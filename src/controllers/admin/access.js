const { Admin } = require('../../../models');
const { generateToken } = require('../../helpers/jwt');
const { comparePass } = require('../../helpers/bcrypt');
const joi = require('joi');
const except = ['createdAt', 'updatedAt'];

//=Admin Get All=\\
exports.admins = async (req, res) => {
  try {
    let allAdmin = await Admin.findAll({
      attributes: {
        exclude: except
      }
    });
    res.status(200).send({
      status: 'Success',
      allAdmin
    });
  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};

//=Admin Register=\\
exports.adminReg = async (req, res) => {
  try {
    const { username } = req.body;
    const data = req.body;
    const scheme = joi.object({
      username: joi.string().min(5).required(),
      password: joi.string().min(5).required()
    });
    const { error } = scheme.validate(data);
    if (error) {
      return res.status(400).json({
        status: 'Validation Error',
        message: error.details[0].message
      });
    };
    const userCheck = await Admin.findOne({
      where: {
        username
      }
    });
    if (userCheck) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Username already Registered'
      });
    };

    const dataAdmin = {
      ...data
    };
    const dataUser = await Admin.create(dataAdmin);
    const token = generateToken(dataUser);
    res.status(201).send({
      message: 'Success',
      token
    });

  } catch (error) {
    res.status({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};

//=Admin Login=\\
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    Admin.findOne({ where: { username } })
      .then(admin => {
        if (!admin || !comparePass(password, admin.password)) {
          res.status(400).send({
            status: 'Failed',
            message: 'Invalid Username or Password'
          });
        } else {
          const access_token = generateToken(admin);
          res.status(200).json({ access_token })
        };
      });

  } catch (err) {
    next(err)
  };
};

//=Admin Update=\\
exports.editAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const adminCheck = await Admin.findOne({ where: { id } });

    if (!adminCheck) {
      return res.status(404).send({
        status: 'Failed',
        message: `Admin ${id} not Found`
      });
    };
    const adminUpdate = {
      ...body,
    };
    await Admin.update(adminUpdate,
      {
        where: {
          id
        },
      });

    res.status(200).send({
      status: 'Success',
      data: {
        id: adminUpdate.id,
        username: adminUpdate.username,
        password: adminUpdate.password
      }
    });
  } catch (error) {
    return res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};