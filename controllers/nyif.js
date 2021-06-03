const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Connection = require("tedious").Connection;
const Request = require("tedious").Request;
const sql = require("mssql");

// @desc    Get SMESIG user with BVN
// @route   Get/api/v1/sme/
// @access   Public/
exports.getNyifUser = asyncHandler(async (req, res, next) => {
  const bvn = req.body.bvn;

  const pool = new sql.ConnectionPool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE2,
  });
  pool.on("error", (err) => {
    // ... error handler
    console.log(err);
  });
  try {
    await pool.connect();
    let result = await pool
      .request()
      .query(`SELECT * FROM ${process.env.Nyif1}  WHERE  BVN = ${bvn}`);
    const id = result.recordset[0].Id;
    const name =
      result.recordset[0].FirstName +
      " " +
      result.recordset[0].SecondName +
      " " +
      result.recordset[0].LastName;
    let results = await pool
      .request()
      .query(`SELECT * FROM ${process.env.Nyif2}  WHERE Id = '${id}'`);
    res.status(200).json({
      success: true,
      loan: results.recordset[0]["ApprovedLoanAmount"],
      name: name,
    });
  } catch (err) {
    return { err: err };
  } finally {
    pool.close(); //closing connection after request is finished.
  }
});
