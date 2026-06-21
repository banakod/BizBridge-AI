import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Businesses from "./pages/Businesses";
import BusinessDetails from "./pages/BusinessDetails";
import AddBusiness from "./pages/AddBusiness";
import EditBusiness from "./pages/EditBusiness";
import AddLead from "./pages/AddLead";
import MyLeads from "./pages/MyLeads";
import AIAssistant from "./pages/AIAssistant";

import OwnerDashboard from "./pages/OwnerDashboard";
import EditMyBusiness from "./pages/EditMyBusiness";
import MapDiscovery from "./pages/MapDiscovery";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Freelancer */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/businesses" element={<Businesses />} />
        <Route path="/businesses/add" element={<AddBusiness />} />
        <Route path="/businesses/edit/:id" element={<EditBusiness />} />
        <Route path="/businesses/:id" element={<BusinessDetails />} />
        <Route path="/businesses/:id/add-lead" element={<AddLead />} />
        <Route path="/leads" element={<MyLeads />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/map" element={<MapDiscovery />} />

        {/* Business Owner */}
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        {/* 🔴 ADDED: separate edit route for owners — goes back to owner-dashboard */}
        <Route path="/owner/edit/:id" element={<EditMyBusiness />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
