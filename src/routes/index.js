const express = require('express');
const router = express.Router();
const { authentication } = require('../middlewares/auth');
const { uploadFile } = require('../middlewares/uploadFile');

const {
  admins,
  adminReg,
  login,
  editAdmin,
} = require('../controllers/admin/access');

const {
  services,
  getService,
  getServiceCategory,
  addService,
  editService,
  deleteService
} = require('../controllers/service');

const {
  galleries,
  galleryId,
  galleryCategory,
  addItemGallery,
  editGallery,
  deleteGallery
} = require('../controllers/galery');

const {
  portofolios,
  portofolioId,
  categoryPortofolio,
  addPortofolio,
  editPortofolio,
  deletePortofolio
} = require('../controllers/portofolio');

const {
  getOrders,
  getOrder,
  addOrder,
  responseOrder,
  deleteOrder
} = require('../controllers/order')

//admin\\
router.get('/admin/data-admin', admins)
router.post('/admin/register', adminReg)
router.post('/admin/login', login)
router.patch('/admin/:id', editAdmin)

//service\\
router.get('/services', services)
router.get('/service/:id', getService)
router.get('/service/category/:category', getServiceCategory)
router.post('/service/add-service', authentication, uploadFile('image', 'layanan'), addService) // <== token
router.patch('/service/edit-service/:id', authentication, uploadFile('image', 'layanan'), editService) // <== token
router.delete('/service/delete/:id', authentication, deleteService) // <== token

//galery
router.get('/galleries', galleries)
router.get('/gallery/:id', galleryId)
router.get('/gallery/category/:category', galleryCategory)
router.post('/gallery/add-item', authentication, uploadFile('image', 'gallery'), addItemGallery) // <== token
router.patch('/gallery/edit-gallery/:id', authentication, uploadFile('image', 'gallery'), editGallery) // <== token
router.delete('/gallery/delete/:id', authentication, deleteGallery) // <== token

//portofolio
router.get('/portofolios', portofolios)
router.get('/portofolio/:id', portofolioId)
router.get('/portofolio/category/:category', categoryPortofolio)
router.post('/portofolio/add-portofolio', authentication, uploadFile('image', 'portofolio'), addPortofolio) // <== token
router.patch('/portofolio/edit-portofolio/:id', authentication, uploadFile('image', 'portofolio'), editPortofolio) // <== token
router.delete('/portofolio/delete/:id', authentication, deletePortofolio) // <== token

//order
router.get('/contact/orders', getOrders)
router.get('/contact/order/:id', getOrder)
router.post('/contact/order', authentication, addOrder)
router.patch('/contact/order/response/:id', authentication, responseOrder)
router.delete('/contact/delete/:id', authentication, deleteOrder)

module.exports = router