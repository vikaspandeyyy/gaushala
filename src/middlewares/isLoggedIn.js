const isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if (req.user) {
    next();
  } else {
    res.status(401).json({ status: false, message: "Unauthenticated!" });
  }
};

module.exports = isLoggedIn;
