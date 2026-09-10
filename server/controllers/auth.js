const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/leadMail.js");
const crypto = require("crypto");

const { pool } = require("../db/connect.js");

const login = async (req, res) => {
  const { username, password } = req.body;

  const [user] = await pool.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);

  if (user.length === 0) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user[0].password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // CREATE JWT HERE
  const token = jwt.sign(
    {
      id: user[0].id,
      username: user[0].username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    },
  );
  /* ****** Use this cookie setting when deployed on HTTPS.
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // change to true when deployed HTTPS
    sameSite: "none",
  });
*/

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // change to true when deployed HTTPS
    sameSite: "lax",
  });

  // use later when deployed on https
  /*
secure: true,
sameSite: "none",
*/

  res.status(200).json({
    message: "Login successful",
  });
};

const createAccount = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide a username, email, and password.",
      });
    }

    // Limit to 2 admin accounts
    const [users] = await pool.query("SELECT COUNT(*) AS total FROM users");
    // "Account creation has been disabled"
    if (users[0].total >= 2) {
      return res.status(403).json({
        message: "Unable to create account. Please contact the administrator.",
      });
    }

    // Check if username or email already exists
    const [existingUser] = await pool.execute(
      `SELECT id FROM users WHERE username = ? OR email = ?`,
      [username, email],
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "Username or email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.execute(
      `INSERT INTO users (username, email, password)
       VALUES (?, ?, ?)`,
      [username, email, hashedPassword],
    );

    // Return the new user (without password)
    const [newUser] = await pool.execute(
      `SELECT id, username, email, created_at
       FROM users
       WHERE id = ?`,
      [result.insertId],
    );

    res.status(201).json({
      msg: "Account created successfully!",
      user: newUser[0],
    });
  } catch (err) {
    console.error("CREATE ACCOUNT ERROR:", err);

    res.status(500).json({
      message: err.message,
      sqlMessage: err.sqlMessage,
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    expires: new Date(0),
    secure: true, // change to true when deployed with HTTPS - false only during production
    sameSite: "none",
  });

  res.status(200).json({
    message: "Logout successful",
  });
};

const forgotUsername = async (req, res) => {
  const { email } = req.body;

  try {
    const [user] = await pool.query(
      "SELECT username FROM users WHERE email = ?",
      [email],
    );

    if (user.length === 0) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    await sendEmail({
      to: email,
      subject: "Username Recovery",
      text: `Your username is: ${user[0].username}`,
    });

    res.status(200).json({
      message: "Username has been emailed",
    });
  } catch (error) {
    console.error("FORGOT USERNAME ERROR:", error);

    res.status(500).json({
      message: "Could not recover username",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [user] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (user.length === 0) {
      return res.status(200).json({
        message: "If an account exists, a recovery email has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await pool.execute(
      "UPDATE users SET reset_token = ?, reset_token_expire = DATE_ADD(NOW(), INTERVAL 15 MINUTE) WHERE id = ?",
      [hashedToken, user[0].id],
      /*
      [resetToken, user[0].id],
      */
    );

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Password Reset",
      text: `Click this link to reset your password:\n\n${resetURL}`,
    });

    res.status(200).json({
      message: "Password reset link sent",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Could not send reset email",
    });
  }
};

const verifyResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [user] = await pool.query(
      `
      SELECT id 
      FROM users 
      WHERE reset_token = ?
      AND reset_token_expire > NOW()
      `,
      [hashedToken],
    );

    if (user.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    res.status(200).json({
      message: "Token valid",
    });
  } catch (error) {
    console.error("VERIFY RESET TOKEN ERROR:", error);

    res.status(500).json({
      message: "Could not verify token",
    });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [user] = await pool.query(
      `
      SELECT id 
      FROM users
      WHERE reset_token = ?
      AND reset_token_expire > NOW()
      `,
      [hashedToken],
    );

    if (user.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      `
      UPDATE users
      SET password = ?,
          reset_token = NULL,
          reset_token_expire = NULL
      WHERE id = ?
      `,
      [hashedPassword, user[0].id],
    );

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Could not reset password",
    });
  }
};

const getCurrentUser = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

module.exports = {
  login,
  createAccount,
  logout,
  forgotUsername,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  getCurrentUser,
};
