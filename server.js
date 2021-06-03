const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Routes Files
const sme = require("./routes/sme");
const nyif = require("./routes/nyif");

//load env vars
dotenv.config({ path: "./config/config.env" });

//connect to database
connectDB();

const app = express();

//Boy Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Set static folder
app.use(express.static(path.join(__dirname, "public")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

//set security headers
app.use(helmet());

//Rate limiting
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 mins
//   max: 100,
// });
// app.use(limiter);

//enable CORS
app.use(cors());

//Mount Routers

app.use("/api/v1/sme/", sme);
app.use("/api/v1/nmfb/", nyif);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // close Server & exit Process

  server.close(() => process.exit(1));
});
