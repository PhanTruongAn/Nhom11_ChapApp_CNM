import api from "../axios/axios";

export const login = async (data: string, password: string) => {
  let res: any;
  if (data.includes("@")) {
    res = await api.post("/auth/login", {
      email: data,
      password,
    });
  } else {
    res = await api.post("/auth/login", {
      phone: data,
      password,
    });
  }
  const token = res.data.token;
  const user = res.data.user;

  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return res.data;
};

export const register = async (
  phone: string,
  password: string,
  email: string,
  name: string,
) => {
  const res = await api.post("/auth/register", {
    phone,
    email,
    password,
    name
  });

  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await api.post("/auth/forgot-password", { email });

  return res.data;
};

export const resetPassword = async (
  password: string,
  confirmPassword: string,
  token: string,
) => {
  const res = await api.put(`/auth/reset-password/${token}`, {
    password,
    confirmPassword,
  });

  return res.data;
};

export const isAuthenticate = (cookies: any) => {
  if (cookies.user) {
    localStorage.setItem("user", JSON.stringify(cookies.user));
  }
  const userData = JSON.parse(localStorage.getItem("user") || "{}") || null;
  const user = userData || cookies.user;
  if (!user) {
    return {};
  }
  return user;
};
