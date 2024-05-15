import React from "react";
import { Link } from "react-router-dom";

export default function EmailVerification() {
  return (
    <main className="main">
      <div className="content">
        <div className="container-fluid pb-5">
          <div className="row justify-content-md-center">
            <div className="card-wrapper col-12 col-md-6 mt-5">
              <div className="brand text-center mb-3">
                <Link to="/">
                  <img src="../../../public/logo.png" alt="" />
                </Link>
              </div>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Verify Your Email Address</h4>
                  <div className="alert alert-success" role="alert">
                    A fresh verification link has been sent to your email
                    address.
                  </div>
                  please check your email for a verification
                  link.
                  {/* <Link to="/">click here to request another</Link>.  */}
                </div>
              </div>
              <footer className="footer mt-3">
                <div className="container-fluid">
                  <div className="footer-content text-center small">
                    <span className="text-muted"></span>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
