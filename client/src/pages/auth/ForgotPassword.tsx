import React, { useState } from "react";
import { forgotPassword } from "../../services/auth";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const handleForgotPassword = async (e: any) => {
    e.preventDefault();

    const validEmail = validateEmail(email);
    if (!validEmail) {
      toast.error("Please enter a valid email");
      return;
    }

    const res = await forgotPassword(email);

    if (res.status === "success") {
        setTimeout(() => {
            navigate("/email-verification");
        }, 2000)
    } else {
        toast.error(res.message)
        return;
    }
  };

  return (
    <main className="main">
      <div className="content">
        <div className="container-fluid pb-5">
          <div className="row justify-content-md-center">
            <div className="card-wrapper col-12 col-md-4 mt-5">
              <div className="brand text-center mb-3">
                <Link to="/">
                  <img src="public/img/logo.png" alt="" />
                </Link>
              </div>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Forgot Password</h4>
                  <form onSubmit={handleForgotPassword}>
                    <div className="form-group">
                      <label>E-Mail Address</label>
                      <input
                        type="email"
                        className="form-control"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group no-margin">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        Send Password Reset Link
                      </button>
                    </div>
                    <div className="text-center mt-3 small">
                      Don't have an account? <Link to="/register">Sign Up</Link>
                    </div>
                  </form>
                </div>
              </div>
              <footer className="footer mt-3">
                <div className="container-fluid">
                  <div className="footer-content text-center small">
                    <span className="text-muted">
                      &copy; 2023 Graindashboard. All Rights Reserved.
                    </span>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
}
