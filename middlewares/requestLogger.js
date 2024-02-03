const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const accessToken = req.headers.authorization || "access-token"; // Assuming the access token is in the authorization header

  console.log(
    `[${timestamp}] ${req.method}: ${req.url}, AccessToken: "${accessToken}"`
  );

  next();
};

module.exports = requestLogger;
