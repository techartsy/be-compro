const { verifyToken } = require('../helpers/jwt');
const { Admin } = require('../../models');

exports.authentication = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).send({
      status: 'Failed',
      message: 'Unauthorized'
    });
  };

  try {
    const token = header.replace('Bearer ', '');
    const verified = verifyToken(token);

    if (verified) {
      Admin.findOne({
        where: {
          id: verified.id
        }
      })
        .then(data => {
          if (data) {
            req.userData = verified
            next()
          } else {
            res.status(404).send({
              status: 'Failed',
              message: 'User not Found'
            })
          };
        })
        .catch(error => {
          console.log(error);
        })
    } else {
      res.status(401).send({
        status: 'Failed',
        message: 'User Unauthorized'
      })
    }
  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Error'
    })
  };
};

