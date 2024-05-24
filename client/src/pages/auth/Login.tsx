import { useState } from "react";
import { login } from "../../services/auth";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const [data, setData] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (!data || !password) {
      toast.error("Please enter valid information");
      return;
    }

    if (data.includes("@")) {
      const validEmail = validateEmail(data);
      if (!validEmail) {
        toast.error("Invalid email");
        return;
      }
    }

    const res = await login(data, password);
    console.log(res.message);
    if (res.status === "success") {
      navigate("/");
    } else {
      // alert("Phone number or password wrong")
      toast.error("Phone number or password wrong");
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
                  <img src="../../../public/logo.png" alt="" />
                </Link>
              </div>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Login</h4>
                  <form onSubmit={handleLogin}>
                    <div className="form-group">
                      <label>Phone or Email</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) => setData(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        className="form-control"
                        onChange={(e) => setPassword(e.target.value)}
                        required={true}
                      />
                      <div className="text-right">
                        <Link to="/forgot-password" className="small">
                          Forgot Your Password?
                        </Link>
                      </div>
                    </div>
                    <div className="form-group no-margin">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        Sign In
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
                      &copy; 2019 Graindashboard. All Rights Reserved.
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
