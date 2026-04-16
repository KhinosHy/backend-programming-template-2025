const gachaRepository = require('./gachaRepository');

// Daftar hadiah dan kuota pemenang (total periode, bukan per hari)
const PRIZES = [
  { name: 'Emas 10 gram', quota: 1, weight: 1 },
  { name: 'Smartphone X', quota: 5, weight: 5 },
  { name: 'Smartwatch Y', quota: 10, weight: 10 },
  { name: 'Voucher Rp100.000', quota: 100, weight: 100 },
  { name: 'Pulsa Rp50.000', quota: 500, weight: 500 },
];

const MAX_GACHA_PER_DAY = 5;

// Fungsi untuk menyamarkan nama user
const maskName = (name) => {
  const parts = name.split(' ');
  return parts
    .map((part) => {
      if (part.length <= 1) return part;
      // Acak: tampilkan karakter pertama dan terakhir, sisanya *
      const masked = part
        .split('')
        .map((char, idx) => {
          if (idx === 0) return char;
          if (idx === part.length - 1) return char;
          // Acak apakah karakter ini ditampilkan atau tidak
          return Math.random() < 0.4 ? char : '*';
        })
        .join('');
      return masked;
    })
    .join(' ');
};

// Logika gacha utama
const performGacha = async ({ userId, userName }) => {
  // 1. Cek kuota harian user
  const todayCount = await gachaRepository.countTodayGachaByUser(userId);
  if (todayCount >= MAX_GACHA_PER_DAY) {
    throw new Error('QUOTA_EXCEEDED');
  }

  // 2. Tentukan hadiah yang masih tersedia
  const availablePrizes = [];
  for (const prize of PRIZES) {
    const winnerCount = await gachaRepository.countPrizeWinners(prize.name);
    if (winnerCount < prize.quota) {
      availablePrizes.push({ ...prize, remaining: prize.quota - winnerCount });
    }
  }

  // 3. Lakukan random gacha dengan weighted probability
  // Total slot hadiah yang tersisa
  const totalPrizeSlots = availablePrizes.reduce((sum, p) => sum + p.remaining, 0);

  // Peluang menang = total slot tersisa / (total slot + "tidak menang" slot)
  // Kita set "tidak menang" = 10x total prize slots agar tidak terlalu sering menang
  const noWinSlots = totalPrizeSlots * 10;
  const totalSlots = totalPrizeSlots + noWinSlots;

  let wonPrize = null;
  const roll = Math.random() * totalSlots;

  if (roll < totalPrizeSlots) {
    // User menang, tentukan hadiahnya
    let cumulative = 0;
    for (const prize of availablePrizes) {
      cumulative += prize.remaining;
      if (roll < cumulative) {
        wonPrize = prize.name;
        break;
      }
    }
  }

  // 4. Simpan log ke DB
  const log = await gachaRepository.createGachaLog({
    userId,
    userName,
    prize: wonPrize,
  });

  return { log, wonPrize, todayCount: todayCount + 1 };
};

// Ambil histori gacha user
const getGachaHistory = async (userId) => {
  return gachaRepository.getGachaHistoryByUser(userId);
};

// Ambil status kuota hadiah saat ini
const getPrizeStatus = async () => {
  const result = [];
  for (const prize of PRIZES) {
    const winnerCount = await gachaRepository.countPrizeWinners(prize.name);
    result.push({
      prize: prize.name,
      quota: prize.quota,
      winners: winnerCount,
      remaining: prize.quota - winnerCount,
    });
  }
  return result;
};

// Ambil daftar pemenang per hadiah (nama disamarkan)
const getWinnersPerPrize = async () => {
  const result = [];
  for (const prize of PRIZES) {
    const winners = await gachaRepository.getWinnersByPrize(prize.name);
    result.push({
      prize: prize.name,
      quota: prize.quota,
      totalWinners: winners.length,
      winners: winners.map((w) => ({
        maskedName: maskName(w.userName),
        wonAt: w.gachaAt,
      })),
    });
  }
  return result;
};

module.exports = {
  performGacha,
  getGachaHistory,
  getPrizeStatus,
  getWinnersPerPrize,
};