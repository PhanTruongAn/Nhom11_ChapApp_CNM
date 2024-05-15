import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import api from "../../axios/axios";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [isShow, setIsShow] = useState(false);
  const handleLogout = async () => {
    const res = await api.post("/auth/logout");
    if (res.data.status === "success") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      removeCookie("user");
      removeCookie("jwt");
      removeCookie("token");
      navigate("/login");
    }
  };
  return (
    <>
      <header className="header bg-body">
        <nav className="navbar flex-nowrap p-0">
          <div className="navbar-brand-wrapper d-flex align-items-center col-auto">
            <Link className="navbar-brand navbar-brand-mobile" to="/">
              <img
                className="img-fluid w-100"
                src="https://res.cloudinary.com/dyp4yk66w/image/upload/v1713170509/logo/logo-mini_u6rdth.png"
                alt="Graindashboard"
              />
            </Link>
            <Link className="navbar-brand navbar-brand-desktop" to="/">
              <img
                className="side-nav-show-on-closed"
                src="https://res.cloudinary.com/dyp4yk66w/image/upload/v1713170509/logo/logo-mini_u6rdth.png"
                alt="Graindashboard"
                style={{ width: "auto", height: 33 }}
              />
              <img
                className="side-nav-hide-on-closed"
                src="https://res.cloudinary.com/dyp4yk66w/image/upload/v1713170505/logo/logo_zuehe0.png"
                alt="Graindashboard"
                style={{ width: "auto", height: 33 }}
              />
            </Link>
          </div>
          <div className="header-content col px-md-3">
            <div className="d-flex align-items-center">
              <Link
                to="#"
                className="js-side-nav header-invoker d-flex mr-md-2"
              >
                <i className="gd-align-left" />
              </Link>
              <div className="dropdown ml-auto">
                <Link className="header-invoker" to="#">
                  <span className="indicator indicator-bordered indicator-top-right indicator-primary rounded-circle" />
                  <i className="gd-bell" />
                </Link>
                <div
                  id="notifications"
                  className="dropdown-menu dropdown-menu-center py-0 mt-4 w-18_75rem w-md-22_5rem unfold-css-animation unfold-hidden"
                  aria-labelledby="notificationsInvoker"
                  style={{ animationDuration: "300ms" }}
                >
                  <div className="card">
                    <div className="card-header d-flex align-items-center border-bottom py-3">
                      <h5 className="mb-0">Notifications</h5>
                      <Link className="link small ml-auto" to="#">
                        Clear All
                      </Link>
                    </div>
                    <div className="card-body p-0">
                      <div className="list-group list-group-flush">
                        <div className="list-group-item list-group-item-action">
                          <div className="d-flex align-items-center text-nowrap mb-2">
                            <i className="gd-info-alt icon-text text-primary mr-2" />
                            <h6 className="font-weight-semi-bold mb-0">
                              New Update
                            </h6>
                            <span className="list-group-item-date text-muted ml-auto">
                              just now
                            </span>
                          </div>
                          <p className="mb-0">
                            Order <strong>#10000</strong> has been updated.
                          </p>
                          <Link
                            className="list-group-item-closer text-muted"
                            to="#"
                          >
                            <i className="gd-close" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dropdown mx-3 dropdown ml-2">
                <Link className="header-complex-invoker" to="#">
                  <span className="d-none d-md-block">{user?.name}</span>
                  <i
                    className="gd-angle-down d-none d-md-block ml-2"
                    onClick={() => setIsShow(!isShow)}
                  />
                </Link>
                {isShow && (
                  <ul
                    id="profileMenu"
                    className="unfold unfold-user unfold-light unfold-top unfold-centered position-absolute pt-2 pb-1 mt-4 unfold-css-animation unfold-hidden fadeOut d-block visible opacity"
                    aria-labelledby="profileMenuInvoker"
                    style={{ animationDuration: "300ms" }}
                  >
                    <li className="unfold-item unfold-item-has-divider">
                      <div
                        className="unfold-link d-flex align-items-center text-nowrap cursor-pointer"
                        onClick={handleLogout}
                      >
                        <span className="unfold-item-icon mr-3">
                          <i className="gd-power-off" />
                        </span>
                        Sign Out
                      </div>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
