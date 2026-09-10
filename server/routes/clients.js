const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware.js");

const {
  getAllClients,
  createClient,
  deleteClient,
  updateClient,
  updateClientNote,
} = require("../controllers/clients.js");

router.use(authenticateUser);

router.route("/clients").get(getAllClients);
router.route("/create-client").post(createClient);
router.route("/delete-client/:id").delete(deleteClient);
router.route("/update-client/:id").patch(updateClient);
router.route("/update-client-note/:id").patch(updateClientNote);

module.exports = router;
