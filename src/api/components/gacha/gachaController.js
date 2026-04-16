const gachaService = require('./gachaService');

// POST /gacha
// Body: { userId, userName }
const doGacha = async (req, res) => {
  const { userId, userName } = req.body;

  if (!userId || !userName) {
    return res.status(400).json({
      success: false,
      message: 'userId dan userName wajib diisi.',
    });
  }

  try {
    const { log, wonPrize, todayCount } = await gachaService.performGacha({
      userId,
      userName,
    });

    if (wonPrize) {
      return res.status(200).json({
        success: true,
        message: `Selamat! Kamu memenangkan: ${wonPrize}`,
        data: {
          gachaId: log._id,
          userId,
          userName,
          prize: wonPrize,
          gachaAt: log.gachaAt,
          gachaUsedToday: todayCount,
          gachaRemainingToday: 5 - todayCount,
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'Maaf, kamu tidak memenangkan hadiah kali ini. Coba lagi!',
        data: {
          gachaId: log._id,
          userId,
          userName,
          prize: null,
          gachaAt: log.gachaAt,
          gachaUsedToday: todayCount,
          gachaRemainingToday: 5 - todayCount,
        },
      });
    }
  } catch (err) {
    if (err.message === 'QUOTA_EXCEEDED') {
      return res.status(429).json({
        success: false,
        message: 'Kamu sudah mencapai batas maksimal 5 kali gacha hari ini. Coba lagi besok!',
      });
    }
    throw err;
  }
};

// GET /gacha/history/:userId
const getHistory = async (req, res) => {
  const { userId } = req.params;

  const history = await gachaService.getGachaHistory(userId);

  return res.status(200).json({
    success: true,
    message: 'Histori gacha berhasil diambil.',
    data: history.map((h) => ({
      gachaId: h._id,
      prize: h.prize ?? 'Tidak menang',
      gachaAt: h.gachaAt,
    })),
  });
};

// GET /gacha/prizes
const getPrizes = async (req, res) => {
  const prizes = await gachaService.getPrizeStatus();

  return res.status(200).json({
    success: true,
    message: 'Daftar hadiah dan kuota tersisa.',
    data: prizes,
  });
};

// GET /gacha/winners
const getWinners = async (req, res) => {
  const winners = await gachaService.getWinnersPerPrize();

  return res.status(200).json({
    success: true,
    message: 'Daftar pemenang per hadiah (nama disamarkan).',
    data: winners,
  });
};

module.exports = {
  doGacha,
  getHistory,
  getPrizes,
  getWinners,
};