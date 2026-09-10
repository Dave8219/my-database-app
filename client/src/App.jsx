import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
// import Home from "./Home.jsx";
import Login from "./Login.jsx";
import "./App.css";
import Dashboard from "./Dashboard.jsx";
import Leads from "./Leads.jsx";
import Clients from "./Clients.jsx";
// import HealthInsurance from "./HealthInsurance.jsx";
// import LifeInsurance from "./LifeInsurance.jsx";
// import Medicare from "./Medicare.jsx";
// import About from "./About.jsx";
// import Contact from "./Contact.jsx";
import Home from "./Home.jsx";
import CreateAccount from "./CreateAccount.jsx";
import ResetPassword from "./ResetPassword.jsx";
import ProtectedRoute from "./ProtectedRoute";
function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {<Route path="/" element={<Home />} />}
        <Route path="/login" element={<Login />} />

        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <Leads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          }
        />
        {/*<Route path="/about" element={<About />} />*/}
        {/*<Route path="/contact" element={<Contact />} />*/}
        {/*<Route path="/health-insurance" element={<HealthInsurance />} />*/}
        {/*<Route path="/medicare" element={<Medicare />} />*/}
        {/*<Route path="/life-insurance" element={<LifeInsurance />} />*/}
      </Routes>
    </>
  );
}

export default App;
