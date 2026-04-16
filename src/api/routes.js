const express = require('express');
const gachaRoutes = require('./components/gacha/gachaRoutes');

module.exports = () => {
  const router = express.Router();

  router.use('/gacha', gachaRoutes);

  return router;
};