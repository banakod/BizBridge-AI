import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import MyProfile from "./pages/MyProfile";
import Notifications from "./pages/Notifications";
import ConnectionRequests from "./pages/ConnectionRequests";
import ViewProfessionalProfile from "./pages/ViewProfessionalProfile";
import ChangePassword from "./pages/ChangePassword";

import Dashboard from "./pages/Dashboard";
import Businesses from "./pages/Businesses";
import BusinessDetails from "./pages/BusinessDetails";
import MyBusiness from "./pages/MyBusiness";
import AddBusiness from "./pages/AddBusiness";
import EditBusiness from "./pages/EditBusiness";
import AddLead from "./pages/AddLead";
import MyLeads from "./pages/MyLeads";
import AIAssistant from "./pages/AIAssistant";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/notifications" element={<Notifications />}/>
        <Route path="/connection-requests" element={<ConnectionRequests />} />
        <Route path="/professional/:userId" element={<ViewProfessionalProfile />}/>
        <Route path="/change-password" element={<ChangePassword />}/>

        {/* Freelancer */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/businesses" element={<Businesses />} />
        <Route path="/businesses/:id" element={<BusinessDetails />} />
        <Route path="/businesses/:id/add-lead" element={<AddLead />} />
        <Route path="/leads" element={<MyLeads />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        {/* Business Owner */}
        <Route path="/my-business" element={<MyBusiness />} />
        <Route path="/register-business" element={<AddBusiness />}/>
        <Route path="/businesses/edit/:id" element={<EditBusiness />} />
        



        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Toaster
       position="top-right"
       reverseOrder={false}
       toastOptions={{
       duration: 3000,
       style: {
       borderRadius: "12px",
       background: "#fff",
       color: "#111827",
       fontWeight: "600",
      },
    }}
   />

    </BrowserRouter>
  );
}

 

export default App;
