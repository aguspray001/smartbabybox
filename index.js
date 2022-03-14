const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();

// router
const measurementRouter = require("./routes/measurement");
const roleRouter = require("./routes/role");
const babyRouter = require("./routes/baby");
const userRouter = require("./routes/user");

// define the app
const app = express();

// define port
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/v1/measurement", measurementRouter);
app.use("/api/v1/role", roleRouter);
app.use("/api/v1/baby", babyRouter);
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`server was connected to ${PORT}`);
});
