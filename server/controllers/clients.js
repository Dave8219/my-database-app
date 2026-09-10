const { pool } = require("../db/connect.js");

// user logs in to see all clients
const getAllClients = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clients");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// client creates client info in the form
const createClient = async (req, res) => {
  try {
    const {
      policy,
      name,
      address,
      email,
      phone,
      insurance_type,
      enrollment_date,
      notes,
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO clients (policy, name, address, email, phone, insurance_type, enrollment_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        policy,
        name,
        address,
        email,
        phone,
        insurance_type,
        enrollment_date,
        notes,
      ],
    );
    const [newClient] = await pool.query(`SELECT * FROM clients WHERE id = ?`, [
      result.insertId,
    ]);
    res.status(201).json(newClient[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message);
  }
};

// user can delete a client
const deleteClient = async (req, res) => {
  try {
    const [result] = await pool.execute(`DELETE FROM clients WHERE id = ?`, [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "client not found" });
    }
    return res.status(200).json({ message: "client deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// user can edit a client

const updateClient = async (req, res) => {
  try {
    const {
      policy,
      name,
      address,
      email,
      phone,
      insurance_type,
      enrollment_date,
      notes,
    } = req.body;

    const result = await pool.execute(
      `UPDATE clients SET policy = ?, name = ?, address = ?, email = ?, phone = ?, insurance_type = ?, enrollment_date = ?, notes = ? WHERE id = ?`,
      [
        policy,
        name,
        address,
        email,
        phone,
        insurance_type,
        enrollment_date,
        notes,
        req.params.id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "update not successful" });
    }
    return res.status(200).json({ message: "client updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

// user can include a note or message on the client

const updateClientNote = async (req, res) => {
  try {
    const { message } = req.body;
    const [update] = await pool.execute(
      `UPDATE clients SET message = ? WHERE id = ?`,
      [message, req.params.id],
    );
    if (update.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "note not working. please try again later." });
    }

    return res.status(200).json({
      message: "note updated successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllClients,
  createClient,
  deleteClient,
  updateClient,
  updateClientNote,
};
