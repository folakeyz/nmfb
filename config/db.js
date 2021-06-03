const sql = require("mssql");

const connectDB = async () => {
  const sqlConfig = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
  };
  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Database Connected Successfully");
    }
  });
};

module.exports = connectDB;
