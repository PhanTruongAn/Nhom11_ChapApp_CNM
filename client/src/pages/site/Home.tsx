import Header from "./Header";
import SideBar from "./SideBar";
import { Link } from "react-router-dom";

export default function Home() {
  const user = JSON.parse(window.localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  return (
    <div>
      <Header />
      <main className="main justify-content-center">
        <SideBar />
        {!token ? (
          <Link to="/login" className="btn btn-primary display-2 align-middle">
            Login
          </Link>
        ) : (
          <h1>Dashboard</h1>
        )}
      </main>
    </div>
  );
}
