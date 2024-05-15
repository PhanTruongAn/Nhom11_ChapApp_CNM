import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";
import api from "../../axios/axios";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../../context/context";

export default function ListUser() {
  const ctx = useContext(AuthContext) as any;
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [typeForm, setTypeForm] = useState("");
  const [isShowForm, setIsShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [phoneUpdate, setPhoneUpdate] = useState("");
  const [nameUpdate, setNameUpdate] = useState("");
  const [emailUpdate, setEmailUpdate] = useState("");
  const [passwordUpdate, setPasswordUpdate] = useState("");
  const [avatarUpdate, setAvatarUpdate] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [roleUpdate, setRoleUpdate] = useState("");
  const [user, setUser] = useState(null) as any;
  

  // const handleUploadImage = (e: any) => {
  //   if (e.target && e.target.files && e.target.files[0]) {
  //     setPreviewImage(URL.createObjectURL(e.target.files[0]));
  //     setAvatarUpdate(e.target.files[0]);
  //   }
  // };

  const getListUsers = async () => {
    const res = await api.get("/user");
    console.log(res)
    setUsers(res.data.users);
  };

  const handleUpdate = async (user: any) => {
    const phone = phoneUpdate === "" ? user.phone : phoneUpdate;
    const name = nameUpdate === "" ? user.name : nameUpdate;
    const email = emailUpdate === "" ? user.email : emailUpdate;
    const password = passwordUpdate === "" ? user.password : passwordUpdate;
    const avatar = avatarUpdate === "" ? user.avatar : avatarUpdate;
    const role = roleUpdate === "" ? user.role : roleUpdate;

    const formData = new FormData();
    formData.append("avatar", avatar);
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    console.log("User: ", user)

    const res = await api.put(`/user/${user._id}`, formData);
    if (res.data.status === "success") {
      toast.success(res.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast.error(res.data.message);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await api.delete(`/user/${id}`);
    console.log("data:", res)
    if (res.data.status === "success") {
      toast.success(res.data.message);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast.error(res.data.message);
    }
  };

  useEffect(() => {
    getListUsers();
  }, []);

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
                      <Link to="#">Users</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      All Users
                    </li>
                  </ol>
                </nav>
                <div className="mb-3 mb-md-4 d-flex justify-content-between">
                  <div className="h3 mb-0">Users</div>
                </div>
                <div className="table-responsive-xl">
                  <table className="table text-nowrap mb-0">
                    <thead>
                      <tr>
                        <th className="font-weight-semi-bold border-top-0 py-2">
                          #
                        </th>
                        <th className="font-weight-semi-bold border-top-0 py-2">
                          Phone Number
                        </th>
                        <th className="font-weight-semi-bold border-top-0 py-2">
                          Full Name
                        </th>
                        <th className="font-weight-semi-bold border-top-0 py-2">
                          Email
                        </th>
                        <th className="font-weight-semi-bold border-top-0 py-2">
                          Role
                        </th>
                        {/* <th className="font-weight-semi-bold border-top-0 py-2">
                          Avatar
                        </th> */}
                        {ctx.user.role === "admin" && (
                          <th className="font-weight-semi-bold border-top-0 py-2">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user: any, index: number) => (
                        <tr key={index}>
                          <td className="align-middle py-3">{index + 1}</td>
                          <td className="align-middle py-3">
                            <div className="d-flex align-items-center">
                              {user.phone}
                            </div>
                          </td>
                          <td className="align-middle py-3">{user.name}</td>
                          <td className="align-middle py-3">{user.email}</td>
                          <td className="align-middle py-3">{user.role}</td>
                          {/* <td className="align-middle py-3">
                            <img
                              src={user.avatar}
                              alt="user avatar"
                              width={100}
                              height={100}
                            />
                          </td> */}
                          {currentUser.role === "admin" && (
                            <td className="align-middle py-3">
                              <div className="position-relative">
                                <span
                                  className="link-dark d-inline-block cursor-pointer"
                                  onClick={() => {
                                    setTypeForm("update");
                                    setIsShowForm(true);
                                    setUser(user);
                                  }}
                                >
                                  <i className="gd-pencil icon-text" />
                                </span>
                                <span
                                  className="link-dark d-inline-block cursor-pointer"
                                  onClick={() => {
                                    setTypeForm("delete");
                                    setIsShowForm(true);
                                    setUser(user);
                                  }}
                                >
                                  <i className="gd-trash icon-text" />
                                </span>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="card-footer d-block d-md-flex align-items-center d-print-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {isShowForm && typeForm === "update" && (
        <>
          <div className="modal d-block">
            <div
              className="cover bg-dark position-absolute w-100 h-100 opacity-md"
              onClick={() => setIsShowForm(false)}
            ></div>
            <div className="content w-50 form-update">
              <div className="py-4 px-3 px-md-4">
                <div className="card mb-3 mb-md-4">
                  <div className="card-body">
                    <nav className="d-none d-md-block" aria-label="breadcrumb">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <span>Users</span>
                        </li>
                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          Update User
                        </li>
                      </ol>
                    </nav>
                    <div className="mb-3 mb-md-4 d-flex justify-content-between">
                      <div className="h3 mb-0">Update User</div>
                    </div>
                    <div>
                      <form>
                        <div className="form-row">
                          <div className="form-group col-12 col-md-6">
                            <label htmlFor="name">Phone Numner</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Phone Number"
                              onChange={(e) => setPhoneUpdate(e.target.value)}
                              defaultValue={user.phone}
                            />
                          </div>
                          <div className="form-group col-12 col-md-6">
                            <label htmlFor="email">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="User Email"
                              onChange={(e) => setEmailUpdate(e.target.value)}
                              defaultValue={user.email}
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          {/* <div className="form-group col-12">
                            <label htmlFor="password">Password</label>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="New Password"
                              onChange={(e) =>
                                setPasswordUpdate(e.target.value)
                              }
                              defaultValue={user.password}
                            />
                          </div> */}
                          <div className="form-group col-12 col-md-12">
                            <label htmlFor="name">Full Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Full name"
                              onChange={(e) => setNameUpdate(e.target.value)}
                              defaultValue={user.name}
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
                                onChange={(e) => setRoleUpdate(e.target.value)}
                              />
                              <label className="form-check-label">User</label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="inlineRadioOptions"
                                value="admin"
                                onChange={(e) => setRoleUpdate(e.target.value)}
                              />
                              <label className="form-check-label">Admin</label>
                            </div>
                          </div>
                        </div>
                        {/* <div className="form-row">
                          <div className="form-group col-12">
                            <label htmlFor="password">Avatar</label>
                            <input
                              type="file"
                              className="form-control"
                              onChange={handleUploadImage}
                            />
                            {previewImage ? (
                              <img
                                src={previewImage}
                                alt=""
                                width={100}
                                height={100}
                              />
                            ) : (
                              <img
                                src={user?.avatar}
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
                            className="btn btn-secondary float-right"
                            onClick={() => setIsShowForm(false)}
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary float-right"
                            onClick={() => handleUpdate(user)}
                          >
                            Update
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {isShowForm && typeForm === "delete" && (
        <>
          <div className="modal d-block">
            <div
              className="cover bg-dark position-absolute w-100 h-100 opacity-md"
              onClick={() => setIsShowForm(false)}
            ></div>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Delete User
                  </h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setIsShowForm(false)}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">Do you want delete this user?</div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      console.log("user: ", user._id);
                      handleDelete(user._id)}}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsShowForm(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <ToastContainer />
    </>
  );
}
