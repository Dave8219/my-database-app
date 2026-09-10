import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./leads.css";
import logo from "./assets/bus-logo.jpeg";

// import { leads } from "./leads.js";

const images = {
  logo,
};

const mapLeadFromAPI = (lead) => ({
  id: lead.id,
  status: lead.status,
  name: lead.name,
  email: lead.email,
  phone: lead.phone,
  insuranceType: lead.insurance_type,
  createdAt: lead.created_at,
  adminNote: lead.admin_note,
  message: lead.message,
});

const formatPhoneNumber = (value) => {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, "");

  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;

  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6,
  )}-${phoneNumber.slice(6, 10)}`;
};

axios.defaults.withCredentials = true;

const Leads = () => {
  const [myLeads, setMyLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [dateFilter, setDateFilter] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeLead, setActiveLead] = useState(null);
  const [mode, setMode] = useState("view"); // view | edit
  const [draft, setDraft] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);

  const leadsPerPage = 10;
  // const [showButtons, setShowButtons] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState({
    status: "new",
    name: "",
    email: "",
    phone: "",
    insuranceType: "",
    message: "",
    adminNotes: "",
  });
  const [errors, setErrors] = useState({});
  // const [editingId, setEditingId] = useState(null);
  /*
  const [editValues, setEditValues] = useState({
    status: "",
    name: "",
    email: "",
    phone: "",
    insuranceType: "",
    message: "",
    adminNotes: "",
  });
*/

  // console.log("API:", import.meta.env.VITE_API_BASE_URL);

  // USE WHEN DEPLOYED
  // const API = import.meta.env.VITE_API_BASE_URL;

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/leads`, {
          withCredentials: true,
        });
        console.log(response.data);

        setMyLeads(response.data.map(mapLeadFromAPI));
        console.log("Mapped:", response.data.map(mapLeadFromAPI));
      } catch (error) {
        console.error("Failed to get leads database", error);
      }
    };
    fetchLeads();
  }, [API_URL]);

  /*
  useEffect(() => {
    const savedLeads = JSON.parse(localStorage.getItem("leads")) || [];

    setMyLeads(savedLeads);
  }, []);
  */
  /*
  const [addedLeads, setAddedLeads] = useState(() => {
    const saved = localStorage.getItem("addedLeads");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("addedLeads", JSON.stringify(addedLeads));
  });
*/

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/api/v1/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleSelectLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id)
        ? prev.filter((leadId) => leadId !== id)
        : [...prev, id],
    );
  };

  const selectAllVisible = () => {
    const visibleIds = paginatedLeads.map((lead) => lead.id);

    const allSelected = visibleIds.every((id) => selectedLeads.includes(id));

    if (allSelected) {
      setSelectedLeads((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedLeads((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const bulkDelete = async () => {
    if (selectedLeads.length === 0) return;

    const confirmDelete = window.confirm(
      `Delete ${selectedLeads.length} selected leads?`,
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_URL}/api/v1/bulk-delete-leads`,
        {
          withCredentials: true,
        },
        {
          data: {
            ids: selectedLeads,
          },
        },
      );

      setMyLeads((prev) =>
        prev.filter((lead) => !selectedLeads.includes(lead.id)),
      );

      setSelectedLeads([]);
    } catch (error) {
      console.error("Could not bulk delete leads:", error);
    }

    /*
    if (selectedLeads.length === 0) return;

    const confirmDelete = window.confirm(
      `Delete ${selectedLeads.length} selected leads?`,
    );

    if (!confirmDelete) return;

    const updated = myLeads.filter((lead) => !selectedLeads.includes(lead.id));

    setMyLeads(updated);
    localStorage.setItem("leads", JSON.stringify(updated));
    setSelectedLeads([]);
*/
  };

  const handleRemove = async (id) => {
    console.log("Deleting id:", id);

    try {
      await axios.delete(`${API_URL}/api/v1/delete-lead/${id}`, {
        withCredentials: true,
      });
      setMyLeads((prev) => {
        return prev.filter((lead) => lead.id !== id);
      });
    } catch (error) {
      console.error("Could not delete. Please try again.", error);
    }
    /*
    setMyLeads((prev) => {
      const updatedLeads = prev.filter((lead) => lead.id !== id);
      if (activeLead?.id === id) {
        setActiveLead(null);
      }
      localStorage.setItem("leads", JSON.stringify(updatedLeads));

      return updatedLeads;
    });
*/
    setCurrentPage(1);
  };

  /*
  const handleEdit = (lead) => {
    // setEditingId(lead.id);
    
  //  setEditValues({
      status: lead.status,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      insuranceType: lead.insuranceType,
      notes: lead.notes,
    });
    
    setEditValues(lead);
  };
*/

  /*
 const handleSave = (updatedLead) {}
*/

  const handleSave = async (updatedLead) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/v1/update-lead/${updatedLead.id}`,
        {
          status: updatedLead.status,
          name: updatedLead.name,
          email: updatedLead.email,
          phone: updatedLead.phone,
          insurance_type: updatedLead.insuranceType,
          admin_note: updatedLead.adminNote,
        },

        {
          withCredentials: true,
        },
      );

      setMyLeads((prev) =>
        prev.map((lead) =>
          lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead,
        ),
      );
      /*
      setEditingId(null);
      setShowButtons(false);
      */
      setActiveLead(updatedLead);
    } catch (error) {
      console.error("Could not update. Please try again.", error);
    }

    /*
    setMyLeads((prev) => {
      const updated = prev.map((l) =>
        l.id === updatedLead.id ? updatedLead : l,
      );

      localStorage.setItem("leads", JSON.stringify(updated));

      return updated;

      
     //  return prev.map((l) => (l.id === id ? { ...l, ...editValues } : l));
    
    });

    // setEditingId(null);
    //setShowButtons(false);
*/
  };

  const validateLead = () => {
    const newErrors = {};

    if (!newLead.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!newLead.email.trim() && !newLead.phone.trim()) {
      newErrors.contact = "Enter an email or phone number.";
    }

    if (
      newLead.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newLead.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    // 🔥 DUPLICATE CHECK (EMAIL + PHONE)
    const emailExists =
      newLead.email &&
      myLeads.some(
        (lead) => lead.email?.toLowerCase() === newLead.email.toLowerCase(),
      );

    const phoneExists =
      newLead.phone && myLeads.some((lead) => lead.phone === newLead.phone);

    if (emailExists) {
      newErrors.duplicate = "A lead with this email already exists.";
    }

    if (phoneExists) {
      newErrors.duplicate = "A lead with this phone already exists.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAddLead = async () => {
    if (!validateLead()) return;

    const payload = {
      status: newLead.status,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      insurance_type: newLead.insuranceType,
      message: newLead.message,
      admin_note: newLead.adminNotes,
      created_at: new Date().toISOString(),
    };

    const response = await axios.post(
      `${API_URL}/api/v1/admin/create-lead`,
      payload,
      {
        withCredentials: true,
      },
    );

    console.log("POST RESPONSE", response.data);

    /*
    const lead = {
      id: Date.now(),

      //   created: new Date().toLocaleDateString(),
      created: new Date().toISOString(),
      ...newLead,
    };

    const updatedLeads = [...myLeads, lead];
setMyLeads(updatedLeads);
*/
    setMyLeads((prev) => [...prev, mapLeadFromAPI(response.data)]);
    setCurrentPage(1);

    /*
    localStorage.setItem("leads", JSON.stringify(updatedLeads));
*/
    setNewLead({
      status: "new",
      name: "",
      email: "",
      phone: "",
      insuranceType: "",
      message: "",
      adminNotes: "",
      createdAt: "",
    });
    setErrors({});
    setShowAddLead(false);
  };

  /*
  const filteredLeads = [...myLeads];
*/

  /*
  const filteredLeads = myLeads.filter((lead) => {
    if (dateFilter === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      return new Date(lead.created) >= oneMonthAgo;
    }

    return true;
  });
*/

  let filteredLeads = myLeads.filter((lead) => {
    // Last 30 Days filter
    if (dateFilter === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      if (new Date(lead.createdAt) < oneMonthAgo) {
        return false;
      }
    }

    // Search filter
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      lead.name?.toLowerCase().includes(search) ||
      lead.email?.toLowerCase().includes(search) ||
      lead.phone?.toLowerCase().includes(search) ||
      lead.insuranceType?.toLowerCase().includes(search);

    // ✅ STATUS FILTER (THIS IS THE MISSING PIECE)
    const matchesStatus =
      statusFilter === "all" ||
      (lead.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  filteredLeads.sort((a, b) => {
    const getSafe = (val) => (val || "").toLowerCase();

    switch (dateFilter) {
      case "latest":
        return new Date(b.createdAt) - new Date(a.createdAt);

      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);

      case "name-asc":
        return getSafe(a.name).localeCompare(getSafe(b.name));

      case "name-desc":
        return getSafe(b.name).localeCompare(getSafe(a.name));

      case "email-asc":
        return getSafe(a.email).localeCompare(getSafe(b.email));

      case "email-desc":
        return getSafe(b.email).localeCompare(getSafe(a.email));

      default:
        return 0;
    }
  });

  if (dateFilter === "month") {
    const oneMonthAgo = new Date();

    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    /*
    filteredLeads.splice(
      0,
      filteredLeads.length,
      ...filteredLeads.filter((lead) => new Date(lead.created) >= oneMonthAgo),
    );
    */
  }

  const lastLeadIndex = currentPage * leadsPerPage;
  const firstLeadIndex = lastLeadIndex - leadsPerPage;

  const paginatedLeads = filteredLeads.slice(firstLeadIndex, lastLeadIndex);

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  // console.log(myLeads);
  return (
    <>
      <div className="leads-page">
        <header className="site-header">
          <div className="logo">
            <Link to="/dashboard">
              <img
                src={images.logo}
                className="img-logo"
                alt="image of business logo"
              />
            </Link>
          </div>

          <div className="dashboard-box">
            <Link to="/dashboard">
              <h5 className="dashboard-text">Dashboard</h5>
            </Link>
          </div>

          <div className="logout-box" onClick={handleLogout}>
            <h5 className="logout-text">Logout</h5>
          </div>
        </header>

        <div className="head-title-container">
          <div className="lead-search-container">
            <input
              type="text"
              className="lead-search-input"
              placeholder="Search by name, email, phone, or insurance..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="leads-heading-container">
            <h1 className="leads-heading">Leads</h1>
          </div>

          <div className="bulk-actions">
            {!selectionMode ? (
              <button onClick={() => setSelectionMode(true)}>Select</button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setSelectionMode(false);
                    setSelectedLeads([]);
                  }}
                >
                  Done
                </button>

                <button onClick={selectAllVisible}>Select All (Page)</button>

                <button
                  onClick={bulkDelete}
                  disabled={selectedLeads.length === 0}
                >
                  Delete Selected ({selectedLeads.length})
                </button>
              </>
            )}
          </div>
        </div>
        <main className="main-content-container">
          <section className="leads-container">
            <div className="title-container">
              <div>
                <h2 className="leads-titles">Status</h2>
              </div>
              <div>
                <h2 className="leads-titles">Name</h2>
              </div>
              <div>
                <h2 className="leads-titles">Email</h2>
              </div>
              <div>
                <h2 className="leads-titles">Phone</h2>
              </div>
              {/*
              <div>
                <h2 className="leads-titles">Ins. Type</h2>
              </div>

              <div>
                <h2 className="leads-titles">Msg</h2>
              </div>
*/}
              <div>
                <h2 className="leads-titles">Notes</h2>
              </div>

              <div>
                <h2 className="leads-titles">Created</h2>
              </div>
            </div>

            {/* <div className="bulk-actions">
              <button onClick={selectAllVisible}>Select All (Page)</button>

              <button
                onClick={bulkDelete}
                disabled={selectedLeads.length === 0}
              >
                Delete Selected ({selectedLeads.length})
              </button>
            </div> */}

            {/* <div className="lead-search-container">
              <input
                type="text"
                className="lead-search-input"
                placeholder="Search by name, email, phone, or insurance..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div> */}

            <div className="lead-filter-container">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="client">Client</option>
              </select>

              <label className="sort-label">Sort By:</label>

              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);

                  setCurrentPage(1);
                }}
                className="sort-input"
              >
                <option value="latest" className="sort-selector">
                  Latest First
                </option>
                <option value="oldest" className="sort-selector">
                  Oldest First
                </option>
                <option value="month" className="sort-selector">
                  Last 30 Days
                </option>

                <option value="name-asc">Name (A → Z)</option>
                <option value="name-desc">Name (Z → A)</option>

                <option value="email-asc">Email (A → Z)</option>
                <option value="email-desc">Email (Z → A)</option>
              </select>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="empty-state">
                <h3>
                  {" "}
                  {myLeads.length === 0 ? "No leads yet" : "No matching leads"}
                </h3>
                <p>
                  {myLeads.length === 0
                    ? "Add your first lead to get started."
                    : "Try changing your filters or search criteria."}
                </p>
              </div>
            ) : (
              <RenderLeads
                myLeads={paginatedLeads}
                handleRemove={handleRemove}
                handleSave={handleSave}
                activeLead={activeLead}
                setActiveLead={setActiveLead}
                mode={mode}
                setMode={setMode}
                draft={draft}
                setDraft={setDraft}
                selectedLeads={selectedLeads}
                toggleSelectLead={toggleSelectLead}
                selectionMode={selectionMode}
              />
            )}
            <div className="pagination-container">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span className="page-text">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

            <div className="add-lead-container">
              <button
                onClick={() => setShowAddLead(true)}
                className="add-lead-btn"
              >
                Add Lead
              </button>
            </div>
            {showAddLead && (
              <div className="add-lead-form">
                <select
                  className="edit-lead-input"
                  value={newLead.status}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="client">Client</option>
                </select>

                <input
                  placeholder="Name"
                  value={newLead.name}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      name: e.target.value,
                    })
                  }
                />

                {errors.name && <p className="form-error">{errors.name}</p>}

                <input
                  placeholder="Email"
                  value={newLead.email}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      email: e.target.value,
                    })
                  }
                />

                {errors.email && <p className="form-error">{errors.email}</p>}

                <input
                  placeholder="Phone"
                  value={newLead.phone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setNewLead({
                      ...newLead,
                      phone: formatted,
                    });
                  }}
                />

                {errors.contact && (
                  <p className="form-error">{errors.contact}</p>
                )}

                <input
                  placeholder="Notes"
                  value={newLead.adminNotes}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      adminNotes: e.target.value,
                    })
                  }
                />

                {errors.duplicate && (
                  <p className="form-error">{errors.duplicate}</p>
                )}

                <div className="save-lead-btn-container">
                  <button onClick={handleAddLead} className="save-lead-btn">
                    Save Lead
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>

        <footer className="footer-container">
          <p className="footer-text">© 2026 Database. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

const RenderLeads = ({
  myLeads,
  handleRemove,
  handleSave,
  activeLead,
  setActiveLead,
  mode,
  setMode,
  draft,
  setDraft,
  selectedLeads,
  toggleSelectLead,
  selectionMode,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      setDraft((prev) => ({
        ...prev,
        phone: formatted,
      }));
      return;
    }

    setDraft((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* TABLE */}
      {myLeads.map((lead) => {
        const {
          id,
          status,
          name,
          email,
          phone,
          insuranceType,
          message,
          adminNote,
          createdAt,
        } = lead;

        return (
          <div
            className="lead-info-box"
            key={id}
            onClick={() => {
              setActiveLead(lead);
              setDraft(lead);
              setMode("view");
            }}
          >
            <div className="status-badge-container">
              {/*<input
                type="checkbox"
                checked={selectedLeads.includes(id)}
                onChange={() => toggleSelectLead(id)}
                onClick={(e) => e.stopPropagation()}
                className="lead-checkbox"
              /> */}

              {selectionMode && (
                <input
                  type="checkbox"
                  checked={selectedLeads.includes(id)}
                  onChange={() => toggleSelectLead(id)}
                  onClick={(e) => e.stopPropagation()}
                  className="lead-checkbox"
                />
              )}

              <p className={`status-badge status-${status}`}>{status}</p>
            </div>

            <div>
              <p className="paragraph-info">{name}</p>
            </div>

            <div>
              <p className="paragraph-info">{email?.slice(0, 10)}...</p>
            </div>

            <div>
              <p className="paragraph-info">{formatPhoneNumber(phone)}</p>
            </div>
            {/*
            <div>
              <p className="paragraph-info">{insuranceType?.slice(0, 10)}...</p>
            </div>

            <div>
              <p className="paragraph-info">{message?.slice(0, 10)}...</p>
            </div>
    */}
            <div>
              <p className="paragraph-info">{adminNote?.slice(0, 10)}...</p>
            </div>
            <div>
              <p className="paragraph-info">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        );
      })}

      {/* CRM PANEL (OUTSIDE MAP — THIS IS CRITICAL) */}
      {activeLead && (
        <div className="lead-panel">
          {mode === "edit" ? (
            <>
              <select
                className="edit-lead-select"
                name="status"
                id="status"
                value={draft?.status || ""}
                onChange={(e) => setDraft({ ...draft, status: e.target.value })}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="client">Client</option>
              </select>

              <input
                name="name"
                placeholder="Name"
                value={draft?.name || ""}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />

              <input
                name="email"
                placeholder="Email"
                value={draft?.email || ""}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />

              <input
                name="phone"
                placeholder="Phone"
                value={draft?.phone || ""}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
              />

              <input
                name="notes"
                placeholder="Notes"
                value={draft?.adminNote || ""}
                onChange={(e) =>
                  setDraft({ ...draft, adminNote: e.target.value })
                }
              />
              <div className="edit-buttons">
                <button
                  onClick={async () => {
                    await handleSave(draft);
                    setActiveLead(draft);
                    setMode("view");
                  }}
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setDraft(activeLead);
                    setMode("view");
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>{activeLead.name}</h2>
              <p>{activeLead.email}</p>
              <p>{formatPhoneNumber(activeLead.phone)}</p>
              <p>{activeLead.insuranceType}</p>

              <p style={{ whiteSpace: "pre-wrap" }}>{activeLead.message}</p>

              <p>{activeLead.notes}</p>

              <div className="panel-actions">
                <button
                  onClick={() => {
                    setDraft(activeLead);
                    setMode("edit");
                  }}
                >
                  Edit
                </button>

                <button onClick={() => handleRemove(activeLead.id)}>
                  Delete
                </button>
                <button onClick={() => setActiveLead(null)}>Close</button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Leads;
