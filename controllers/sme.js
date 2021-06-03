const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const sql = require("mssql");

// @desc    Get SMESIG user with BVN
// @route   Get/api/v1/sme/
// @access   Public/
exports.getSmeUser = asyncHandler(async (req, res, next) => {
  const bvn = req.body.bvn;
  const request = new sql.Request();

  request.query(
    `SELECT * FROM ${process.env.SME2}  WHERE  BVN = ${bvn}`,
    function (err, result) {
      if (err) console.log(err);
      const row = JSON.parse(result.rowsAffected);
      if (row === 0) {
        request.query(
          `SELECT * FROM ${process.env.SMES}  WHERE [Director's BVN] = '${bvn}'`,
          function (err, results) {
            if (err) console.log(err);
            res.status(200).json({
              success: true,
              name: results.recordset[0]["Director's Name"],
              loan: results.recordset[0]["Approved Loan Amount"],
            });
          }
        );
      } else {
        res.status(200).json({
          success: true,
          data: result.recordset,
          name: result.recordset[0]["Name"],
          loan: result.recordset[0]["ApprovedLoanAmount"],
        });
      }
    }
  );
});

// @desc    Get SME Loan Application Form user with BVN
// @route   Get/api/v1/sme/
// @access   Public/
exports.getHouseholdUser = asyncHandler(async (req, res, next) => {
  const bvn = req.body.bvn;
  const request = new sql.Request();
  request.query(
    `SELECT * FROM ${process.env.Household}  WHERE  BVN = '${bvn}'`,
    function (err, result) {
      if (err) console.log(err);
      const row = JSON.parse(result.rowsAffected);
      if (row === 0) {
        request.query(
          `SELECT * FROM ${process.env.Household2}  WHERE  BVN = '${bvn}'`,
          function (err, results) {
            if (err) console.log(err);
            res.status(200).json({
              success: true,
              loan: results.recordset[0].ApprovedLoanAmount,
              name: results.recordset[0].Name,
              account: results.recordset[0].AccountNumber,
            });
          }
        );
      } else {
        res.status(200).json({
          success: true,
          loan: result.recordset[0]["Approved Loan Amount"],
          name: result.recordset[0]["Applicant Name"],
          account: result.recordset[0]["NMFB Account No"],
        });
      }
    }
  );
});
