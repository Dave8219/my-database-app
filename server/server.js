require("dotenv").config();
// require('express-async-errors');
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { pool } = require("./db/connect.js");

const authRouter = require("./routes/auth.js");

const leads = require("./routes/leads.js");
const clients = require("./routes/clients.js");

const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

app.set("trust proxy", 1);

app.use(express.json());

app.use(cookieParser());

app.use(helmet());
// Add your Netlify URL here after you deploy the frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://marciinsurance.com",
  "https://www.marciinsurance.com",
  "https://marciinsurance.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", leads);
app.use("/api/v1", clients);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`server running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
