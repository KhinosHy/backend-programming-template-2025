const express = require('express');

const gachaController = require('./gachaController');

const router = express.Router();

// Endpoint utama: lakukan gacha
// POST /gacha
// Body: { "userId": "user123", "userName": "Jane Doe" }
router.post('/', gachaController.doGacha);

// BONUS 1: Histori gacha seorang user
// GET /gacha/history/:userId
router.get('/history/:userId', gachaController.getHistory);

// BONUS 2: Daftar hadiah dan sisa kuota
// GET /gacha/prizes
router.get('/prizes', gachaController.getPrizes);

// BONUS 3: Daftar pemenang per hadiah (nama disamarkan)
// GET /gacha/winners
router.get('/winners', gachaController.getWinners);

module.exports = router;