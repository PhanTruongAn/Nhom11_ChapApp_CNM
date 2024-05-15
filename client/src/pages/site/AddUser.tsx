import Header from "./Header";
import SideBar from "./SideBar";
import { useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../axios/axios";
import { AuthContext } from "../../context/context";

export default function AddUser() {
  const ctx = useContext(AuthContext) as any;
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState("user");
  const [previewImage, setPreviewImage] = useState("");

  const handleUploadImage = (e: any) => {
    if (e.target && e.target.files && e.target.files[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setAvatar(e.target.files[0]);
    }
  };

  const handleCreate = async () => {
    if (!phone || !password || !email) {
      toast.error("Please enter all fields");
      return;
    }

    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("role", role);
    
    console.log(formData);

    const res = await api.post(`/user/`, formData);


    if (res.data.status === "success") {
      toast.success(res.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <>
      <Header />
      <main className="main">
        <SideBar />
        <div className="content">
          <div className="py-4 px-3 px-md-4">
            <div className="card mb-3 mb-md-4">
              <div className="card-body">
                <nav className="d-none d-md-block" aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <span>Users</span>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Add User
                    </li>
                  </ol>
                </nav>
                <div className="mb-3 mb-md-4 d-flex justify-content-between">
                  <div className="h3 mb-0">Add User</div>
                </div>
                <div>
                  <form>
                  <div className="form-row">
                      <div className="form-group col-12">
                        <label>Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Your Full Name"
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-12 col-md-6">
                        <label htmlFor="name">Phone Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Phone Number"
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div className="form-group col-12 col-md-6">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Your Email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-12">
                        <label>Password</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="New Password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group col-12">
                        <div>
                          <label>Role</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="inlineRadioOptions"
                            value="user"
                            onChange={(e) => setRole(e.target.value)}
                          />
                          <label className="form-check-label">User</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="inlineRadioOptions"
                            value="admin"
                            onChange={(e) => setRole(e.target.value)}
                          />
                          <label className="form-check-label">Admin</label>
                        </div>
                      </div>
                    </div>
                    {/* <div className="form-row">
                      <div className="form-group col-12">
                        <label>Avatar</label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleUploadImage}
                        />
                        {previewImage && (
                          <img
                            src={previewImage}
                            alt=""
                            width={100}
                            height={100}
                          />
                        )}
                      </div>
                    </div> */}
                    <div>
                      <button
                        type="button"
                        className="btn btn-primary float-right"
                        onClick={handleCreate}
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ToastContainer />
    </>
  );
}
