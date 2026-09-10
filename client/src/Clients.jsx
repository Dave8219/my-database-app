import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./clients.css";
import logo from "./assets/bus-logo.jpeg";

const images = {
  logo,
};

const mapClientFromAPI = (client) => ({
  id: client.id,
  policy: client.policy,
  name: client.name,
  address: client.address,
  email: client.email,
  phone: client.phone,
  insuranceType: client.insurance_type,
  enrollmentDate: client.enrollment_date?.split("T")[0],
  notes: client.notes,
  createdAt: client.created_at,
});

const formatPhoneNumber = (value) => {
  const phoneNumber = value.replace(/\D/g, "");

  if (phoneNumber.length < 4) {
    return phoneNumber;
  }

  if (phoneNumber.length < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6,
  )}-${phoneNumber.slice(6, 10)}`;
};

axios.defaults.withCredentials = true;

const Clients = () => {
  const [showForm, setShowForm] = useState(false);
  const [clientForm, setClientForm] = useState({
    policy: "",
    name: "",
    address: "",
    email: "",
    phone: "",
    insuranceType: "",
    enrollmentDate: "",
    notes: "",
  });
  const [addedClients, setAddedClients] = useState(() => {
    const saved = localStorage.getItem("addedClients");
    return saved ? JSON.parse(saved) : [];
  });
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    policy: "",
    name: "",
    address: "",
    email: "",
    phone: "",
    insuranceType: "",
    enrollmentDate: "",
    notes: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const clientsPerPage = 15;

  /*
  useEffect(() => {
    localStorage.setItem("addedClients", JSON.stringify(addedClients));
  }, [addedClients]);
*/

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${API}/api/v1/clients`, {
          withCredentials: true,
        });
        console.log(response.data);

        setAddedClients(response.data.map(mapClientFromAPI));
        console.log("Mapped:", response.data.map(mapClientFromAPI));
      } catch (error) {
        console.error("Failed to get clients database", error);
      }
    };
    fetchLeads();
  }, [API]);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API}/api/v1/auth/logout`,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    /*
    setClientForm((prev) => ({ ...prev, [name]: value }));
    */

    setClientForm((prev) => ({
      ...prev,
      [name]: name === "phone" ? formatPhoneNumber(value) : value,
    }));
  };

  const handleSave = async (id) => {
    try {
      const response = await axios.patch(
        `${API}/api/v1/update-client/${id}`,
        {
          policy: editValues.policy,
          name: editValues.name,
          address: editValues.address,
          email: editValues.email,
          phone: editValues.phone,
          insurance_type: editValues.insuranceType,
          enrollment_date: editValues.enrollmentDate,
          notes: editValues.notes,
        },

        {
          withCredentials: true,
        },
      );

      setAddedClients((prev) =>
        prev.map((client) =>
          client.id === id ? { ...client, ...editValues } : client,
        ),
      );
      /*
      setEditingId(null);
      setShowButtons(false);
      */
      // setActiveLead(updatedLead);
    } catch (error) {
      console.error("Could not update. Please try again.", error);
    }

    setEditingId(null);

    /*
    setAddedClients((prev) => {
      return prev.map((c) => (c.id === id ? { ...c, ...editValues } : c));
    });
    setEditingId(null);
    */
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setEditValues({
      policy: client.policy || "",
      name: client.name || "",
      address: client.address || "",
      email: client.email || "",
      phone: client.phone || "",
      insuranceType: client.insuranceType || "",
      enrollmentDate: client.enrollmentDate || "",
      notes: client.notes || "",
    });
  };

  /*
const handleRemove = async (id) => {
  try {
    await axios.delete(`${API}/api/v1/employees/${id}`);
    setAddedEmployee((prev) => {
      return prev.filter((employee) => employee.id !== id);
    });
  } catch (error) {
    console.error("Could not delete. Please try again.", error);
  }
};
*/

  const handleRemove = async (id) => {
    try {
      await axios.delete(`${API}/api/v1/delete-client/${id}`, {
        withCredentials: true,
      });
      setAddedClients((prev) => {
        return prev.filter((client) => client.id !== id);
      });
    } catch (error) {
      console.error("Could not delete. Please try again.", error);
    }

    /*
    setAddedClients((prev) => {
      return prev.filter((client) => client.id !== id);
    });
    */
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !clientForm.policy ||
      !clientForm.name ||
      !clientForm.address ||
      !clientForm.email ||
      !clientForm.phone ||
      !clientForm.insuranceType ||
      !clientForm.enrollmentDate
    ) {
      return alert("Please provide all information");
    }

    const payload = {
      policy: clientForm.policy,
      name: clientForm.name,
      address: clientForm.address,
      email: clientForm.email,
      phone: clientForm.phone,
      insurance_type: clientForm.insuranceType,
      enrollment_date: clientForm.enrollmentDate,
      notes: clientForm.notes,
      created_at: new Date().toISOString(),
    };

    const response = await axios.post(`${API}/api/v1/create-client`, payload, {
      withCredentials: true,
    });
    console.log("POST RESPONSE", response.data);

    setAddedClients((prev) => [...prev, mapClientFromAPI(response.data)]);

    /*
    const fakeId = Date.now();
    const newClient = {
      id: fakeId,
      ...clientForm,
    };

    const updatedClient = [...addedClients, newClient];
    setAddedClients(updatedClient);
*/
    setClientForm({
      policy: "",
      name: "",
      address: "",
      email: "",
      phone: "",
      insuranceType: "",
      enrollmentDate: "",
      notes: "",
      createdAt: "",
    });
    setShowForm(false);
  };

  const filteredClients = [...addedClients]
    .filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      const lastNameA = a.name.trim().split(" ").slice(-1)[0];

      const lastNameB = b.name.trim().split(" ").slice(-1)[0];

      return lastNameA.localeCompare(lastNameB);
    });

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const startIndex = (currentPage - 1) * clientsPerPage;

  const paginatedClients = filteredClients.slice(
    startIndex,
    startIndex + clientsPerPage,
  );

  return (
    <>
      <div className="clients-page">
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
        <main>
          <div className="clients-heading-container">
            <h1 className="clients-heading">Clients</h1>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search client..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
          </div>

          <section className="content-container">
            <div className="title-container-clients">
              <div>
                <h2 className="heading-titles">Policy No.</h2>
              </div>
              <div>
                <h2 className="heading-titles">Name</h2>
              </div>
              <div>
                <h2 className="heading-titles">Address</h2>
              </div>
              <div>
                <h2 className="heading-titles">Email</h2>
              </div>
              <div>
                <h2 className="heading-titles">Phone</h2>
              </div>
              <div>
                <h2 className="heading-titles">
                  Insurance <br></br>Type
                </h2>
              </div>
              <div>
                <h2 className="heading-titles">Enrollment Date</h2>
              </div>
              <div>
                <h2 className="heading-titles">Notes</h2>
              </div>
            </div>
            <RenderAddedClients
              addedClients={paginatedClients}
              setAddedClients={setAddedClients}
              editingId={editingId}
              handleEdit={handleEdit}
              editValues={editValues}
              setEditValues={setEditValues}
              handleSave={handleSave}
              handleRemove={handleRemove}
            />

            <div className="pagination-container">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={currentPage === page ? "active-page" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                →
              </button>
            </div>

            {showForm && (
              <RenderInputs
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                addedClients={addedClients}
                setShowForm={setShowForm}
                clientForm={clientForm}
              />
            )}
          </section>

          <div className="add-btn-container">
            <button
              className="add-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowForm(true);
              }}
            >
              Add Client
            </button>
          </div>
        </main>

        <footer className="clients-footer">
          <p className="footer-text">© 2026 Database. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

const RenderInputs = ({
  handleSubmit,
  setAddedClients,
  handleChange,
  addedClients,
  clientForm,
  setShowForm,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowForm(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [setShowForm]);

  return (
    <>
      <form ref={containerRef} onSubmit={handleSubmit}>
        <div className="form-input-container">
          <div className="input-box">
            <input
              id="policy"
              name="policy"
              onChange={handleChange}
              value={clientForm.policy}
              className="input-clients-box"
            />
          </div>

          <div className="input-box">
            <input
              id="name"
              name="name"
              onChange={handleChange}
              value={clientForm.name}
              className="input-clients-box"
            />
          </div>

          <div className="input-box">
            <input
              id="address"
              name="address"
              onChange={handleChange}
              value={clientForm.address}
              className="input-clients-box"
            />
          </div>
          <div className="input-box">
            <input
              id="email"
              name="email"
              onChange={handleChange}
              value={clientForm.email}
              className="input-clients-box"
            />
          </div>
          <div className="input-box">
            <input
              id="phone"
              name="phone"
              onChange={handleChange}
              value={clientForm.phone}
              maxLength={14}
              className="input-clients-box"
            />
          </div>
          <div className="input-box">
            <input
              id="insuranceType"
              name="insuranceType"
              onChange={handleChange}
              value={clientForm.insuranceType}
              className="input-clients-box"
            />
          </div>
          <div className="input-box">
            <input
              id="enrollmentDate"
              name="enrollmentDate"
              type="date"
              onChange={handleChange}
              value={clientForm.enrollmentDate}
              className="input-clients-box"
            />
          </div>
          <div className="input-box">
            <input
              id="notes"
              name="notes"
              onChange={handleChange}
              value={clientForm.notes}
              className="input-clients-box"
            />
          </div>
        </div>

        <div className="submit-clients-btn-container">
          <button type="submit" className="submit-clients-btn">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

const RenderAddedClients = ({
  addedClients,
  paginatedClients,
  editingId,
  handleEdit,
  editValues,
  setEditValues,
  handleSave,
  handleRemove,
}) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const containerRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSelectedClient(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditValues((prev) => ({
      ...prev,
      [name]: name === "phone" ? formatPhoneNumber(value) : value,
    }));

    /*
    setEditValues((prev) => ({ ...prev, [name]: value }));
    */
  };

  return (
    <>
      {addedClients.map((client) => {
        const isEditing = editingId === client.id;
        return (
          <div
            key={client.id}
            ref={selectedClient === client.id ? containerRef : null}
            className="clients-container"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedClient(
                selectedClient === client.id ? null : client.id,
              );
            }}
          >
            {isEditing ? (
              <>
                <div className="form-input-container">
                  <div className="input-box">
                    <div className="policy-box">
                      <input
                        id="policy"
                        name="policy"
                        onChange={handleChange}
                        value={editValues.policy}
                        className="input-clients-box"
                      />
                      <div className="edit-btn-container">
                        <div>
                          <button
                            className="save-btn"
                            onClick={() => handleSave(client.id)}
                          >
                            Save
                          </button>
                        </div>
                        <div>
                          <button
                            className="delete-btn"
                            onClick={() => handleRemove(client.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="input-box">
                    <input
                      id="name"
                      name="name"
                      onChange={handleChange}
                      value={editValues.name}
                      className="input-clients-box"
                    />
                  </div>

                  <div className="input-box">
                    <input
                      id="address"
                      name="address"
                      onChange={handleChange}
                      value={editValues.address}
                      className="input-clients-box"
                    />
                  </div>
                  <div className="input-box">
                    <input
                      id="email"
                      name="email"
                      onChange={handleChange}
                      value={editValues.email}
                      className="input-clients-box"
                    />
                  </div>
                  <div className="input-box">
                    <input
                      id="phone"
                      name="phone"
                      onChange={handleChange}
                      value={editValues.phone}
                      maxLength={14}
                      className="input-clients-box"
                    />
                  </div>
                  <div className="input-box">
                    <input
                      id="insuranceType"
                      name="insuranceType"
                      onChange={handleChange}
                      value={editValues.insuranceType}
                      className="input-clients-box"
                    />
                  </div>
                  <div className="input-box">
                    <input
                      id="enrollmentDate"
                      name="enrollmentDate"
                      type="date"
                      onChange={handleChange}
                      value={editValues.enrollmentDate}
                      className="input-clients-box"
                    />
                  </div>
                  <div className="input-box">
                    <input
                      id="notes"
                      name="notes"
                      onChange={handleChange}
                      value={editValues.notes}
                      className="input-clients-box"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="policy-box">
                  <p className="client-info-para">{client.policy}</p>

                  {selectedClient === client.id && (
                    <div className="edit-btn-container">
                      <div>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(client)}
                        >
                          Edit
                        </button>
                      </div>

                      <div>
                        <button
                          className="delete-btn"
                          onClick={() => handleRemove(client.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <p className="client-info-para">{client.name}</p>
                </div>
                <div className="address-box">
                  <p className="client-info-para">{client.address}</p>
                </div>
                <div className="email-box">
                  <p className="client-info-para">{client.email}</p>
                </div>
                <div className="phone-box">
                  <p className="client-info-para">{client.phone}</p>
                </div>
                <div>
                  <p className="client-info-para">{client.insuranceType}</p>
                </div>
                <div>
                  <p className="client-info-para">{client.enrollmentDate}</p>
                </div>
                <div className="notes-box">
                  <p className="client-info-para">{client.notes}</p>
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

export default Clients;
