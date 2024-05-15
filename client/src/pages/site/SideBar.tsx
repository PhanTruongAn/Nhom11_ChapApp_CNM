import { Link } from "react-router-dom";

export default function SideBar() {
  // const user = props?.user;
  const user = JSON.parse(window.localStorage.getItem("user") || "{}");
  return (
    <aside id="sidebar" className="js-custom-scroll side-nav">
      <ul id="sideNav" className="side-nav-menu side-nav-menu-top-level mb-0">
        <li className="sidebar-heading h6">Management User</li>
        <li className="side-nav-menu-item side-nav-has-menu">
          <Link
            className="side-nav-menu-link media align-items-center"
            to="/list-user"
          >
            <span className="side-nav-menu-icon d-flex mr-3">
              <i className="gd-user" />
            </span>
            <span className="side-nav-fadeout-on-closed media-body">
              List User
            </span>
            <span className="side-nav__indicator side-nav-fadeout-on-closed" />
          </Link>
        </li>
        {user?.role === "admin" && (
          <li className="side-nav-menu-item side-nav-has-menu">
            <Link
              className="side-nav-menu-link media align-items-center"
              to="/add-user"
            >
              <span className="side-nav-menu-icon d-flex mr-3">
                <i className="gd-lock" />
              </span>
              <span className="side-nav-fadeout-on-closed media-body">
                Add User
              </span>
              <span className="side-nav__indicator side-nav-fadeout-on-closed" />
            </Link>
          </li>
        )}
      </ul>
    </aside>
  );
}
