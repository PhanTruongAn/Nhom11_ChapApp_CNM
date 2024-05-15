require("dotenv").config();

const configCors = (app) => {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.URL);
    res.header("Access-Control-Allow-Headers", true);
    res.header("Access-Control-Allow-Credentials", true);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type, Authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    next();
  });
};

export default configCors;
