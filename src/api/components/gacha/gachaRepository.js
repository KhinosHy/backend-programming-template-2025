const GachaLog = require('../../../models/gachaLog');

const countTodayGachaByUser = async (userId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  return GachaLog.countDocuments({
    userId,
    gachaAt: { $gte: startOfDay, $lte: endOfDay },
  });
};

const countPrizeWinners = async (prize) => {
  return GachaLog.countDocuments({ prize });
};

const createGachaLog = async ({ userId, userName, prize }) => {
  const log = new GachaLog({ userId, userName, prize });
  return log.save();
};

const getGachaHistoryByUser = async (userId) => {
  return GachaLog.find({ userId }).sort({ gachaAt: -1 });
};

const getWinnersByPrize = async (prize) => {
  return GachaLog.find({ prize }).select('userId userName gachaAt');
};

module.exports = {
  countTodayGachaByUser,
  countPrizeWinners,
  createGachaLog,
  getGachaHistoryByUser,
  getWinnersByPrize,
};
