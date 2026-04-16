const express = require('express');

const gachaController = require('./gachaController');

const router = express.Router();

// ni endpoint pertma
    // POST /gacha
// di body: { "userId": "user123", "userName": "Jane Doe" }
router.post('/', gachaController.doGacha);

// bonus ke 1: histori gacha dari user
router.get('/history/:userId', gachaController.getHistory);
// GET /gacha/history/:userId

// bonus ke 2: daftar hadiah n sisa kuota
router.get('/prizes', gachaController.getPrizes);
// GET /gacha/prizes

// bonus ke 3: daftar pemenang per hadiah (nama anonimus)
router.get('/winners', gachaController.getWinners);
// GET /gacha/winners

module.exports = router;