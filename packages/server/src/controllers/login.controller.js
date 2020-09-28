export const getLoginRender = async (req, res, next) => {
  res.render('login', { useLiveReload: process.env.USE_LIVE_RELOAD });
};
