import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./graindashboard.css";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import EmailVerification from "./pages/auth/EmailVerification";
import ResetPassword from "./pages/auth/ResetPassword";
import Home from "./pages/site/Home";
import ListUser from "./pages/site/ListUser";
import AddUser from "./pages/site/AddUser";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/list-user" element={<ListUser />} />
      <Route path="/add-user" element={<AddUser />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/email-verification" element={<EmailVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
