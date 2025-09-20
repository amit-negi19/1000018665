function logger(req, res, next) {
  console.log(`Logged: ${req.method} ${req.path} [${new Date().toISOString()}]`);
  next();
}

module.exports = logger;
