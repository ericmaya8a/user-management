export const getRender = async (req, res, next) => {
  res.render('index', { useLiveReload: process.env.USE_LIVE_RELOAD });
};
