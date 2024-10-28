const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const { dbConnection } = require("./config/connect");
const globalerrorHandler = require("./middlewares/globalErrorMiddleware");

const authRoute = require("./routes/authRoute");
const morgan = require("morgan");

//express aapp
const app = express();

//database connect
dbConnection();

//middlewares
app.use(express.json({ limit: "50kb" }));
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//mout routes
app.use("/api/v1/auth", authRoute);

//global error handler
app.use(globalerrorHandler);

const server = app.listen(8000, () => {
  console.log("Server started on port 8000");
});

// rejection outside express server
process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection", err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
