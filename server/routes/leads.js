const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware.js");
const {
  getAllLeads,
  createLead,
  createAdminLead,
  deleteLead,
  bulkDeleteLeads,
  updateLead,
  updateLeadNote,
} = require("../controllers/leads.js");

router.route("/leads").get(authenticateUser, getAllLeads);
// public create lead
router.route("/create-lead").post(createLead);
// admin create lead
router.route("/admin/create-lead").post(authenticateUser, createAdminLead);

router.route("/delete-lead/:id").delete(authenticateUser, deleteLead);
router.route("/bulk-delete-leads").delete(authenticateUser, bulkDeleteLeads);
router.route("/update-lead/:id").patch(authenticateUser, updateLead);
router.route("/update-lead-note/:id").patch(authenticateUser, updateLeadNote);

module.exports = router;
