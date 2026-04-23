const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User');

router.post('/', UserController.create);
router.get('/', UserController.findAll);
router.get('/:id', UserController.findOne);
router.patch('/:id', UserController.update);
router.delete('/:id', UserController.destroy);

module.exports = router;
