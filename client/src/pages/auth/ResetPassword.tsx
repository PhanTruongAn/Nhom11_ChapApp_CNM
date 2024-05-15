import { faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { resetPassword } from "../../services/auth";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const [isValidOneLetterUpper, setIsValidOneLetterUpper] = useState(false);
  const [isValidOneNumber, setIsValidOneNumber] = useState(false);
  const [isValidOneSpecialCharacter, setIsValidOneSpecialCharacter] =
    useState(false);
  const valid8CharactersIcon = password.length >= 8 ? faCheckCircle : faTimes;
  const valid8CharactersClass =
    password.length >= 8 ? "text-success" : "text-danger";

  const validOneLetterUpperIcon = isValidOneLetterUpper
    ? faCheckCircle
    : faTimes;
  const validOneLetterUpperClass = isValidOneLetterUpper
    ? "text-success"
    : "text-danger";

  const validOneNumberClass = isValidOneNumber ? "text-success" : "text-danger";
  const validOneNumberIcon = isValidOneNumber ? faCheckCircle : faTimes;

  const validOneSpecialCharacterClass = isValidOneSpecialCharacter
    ? "text-success"
    : "text-danger";
  const validOneSpecialCharacterIcon = isValidOneSpecialCharacter
    ? faCheckCircle
    : faTimes;

  const comparePasswordIcon =
    password && passwordConfirm && password === passwordConfirm
      ? faCheckCircle
      : faTimes;
  const comparePasswordClass =
    password && passwordConfirm && password === passwordConfirm
      ? "text-success"
      : "text-danger";
  const comparePasswordText =
    password && passwordConfirm && password === passwordConfirm
      ? "Correct"
      : "Incorrect";

  const validatePasswordOneLetterUpper = (password: string) => {
    return String(password).match(/[A-Z]/);
  };

  const validateOneNumber = (password: string) => {
    return String(password).match(/[1-9]/);
  };

  const validateOneSpecialCharacter = (password: string) => {
    return String(password).match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/);
  };

  useEffect(() => {
    if (validatePasswordOneLetterUpper(password)) {
      setIsValidOneLetterUpper(true);
    }

    if (validateOneNumber(password)) {
      setIsValidOneNumber(true);
    }

    if (validateOneSpecialCharacter(password)) {
      setIsValidOneSpecialCharacter(true);
    }

    if (!password || !validatePasswordOneLetterUpper(password)) {
      setIsValidOneLetterUpper(false);
    }

    if (!password || !validateOneNumber(password)) {
      setIsValidOneNumber(false);
    }

    if (!password || !validateOneSpecialCharacter(password)) {
      setIsValidOneSpecialCharacter(false);
    }
  }, [password]);

  const handleResetPassword = async (e: any) => {
    e.preventDefault();

    if (!password || !passwordConfirm) {
      toast.error("Please enter valid information");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("Password not same with confirmation");
      return;
    }

    if (
      !validatePasswordOneLetterUpper(password) ||
      !validateOneNumber(password) ||
      !validateOneSpecialCharacter(password)
    ) {
      toast.error("Please enter exactly password required");
      return;
    }

    const res = await resetPassword(password, passwordConfirm, token!);
console.log(res);
    if (res.status === "success") {
      toast.success("Password changed successfully");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      toast.error(res.message);
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
                  <h4 className="card-title">Reset Password</h4>
                  <form onSubmit={handleResetPassword}>
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        className="form-control"
                        required={true}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <ul className="list-unstyled mb-0">
                        <li className="requirements">
                          <FontAwesomeIcon
                            icon={valid8CharactersIcon}
                            className={`${valid8CharactersClass} mr-1`}
                          />
                          <span className={valid8CharactersClass}>
                            Password must have at least 8 chars
                          </span>
                        </li>
                        <li className="requirements big-letter">
                          <FontAwesomeIcon
                            icon={validOneLetterUpperIcon}
                            className={`${validOneLetterUpperClass} mr-1`}
                          />
                          <span className={validOneLetterUpperClass}>
                            Password must have at least 1 big letter.
                          </span>
                        </li>
                        <li className="requirements num">
                          <FontAwesomeIcon
                            icon={validOneNumberIcon}
                            className={`${validOneNumberClass} mr-1`}
                          />
                          <span className={validOneNumberClass}>
                            Password must have at least 1 number.
                          </span>
                        </li>
                        <li className="requirements special-char">
                          <FontAwesomeIcon
                            icon={validOneSpecialCharacterIcon}
                            className={`${validOneSpecialCharacterClass} mr-1`}
                          />
                          <span className={validOneSpecialCharacterClass}>
                            Password must have at least 1 special char.
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="form-group">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        className="form-control"
                        required={true}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                      />
                      <ul className="list-unstyled">
                        <li className="requirements special-char">
                          <FontAwesomeIcon
                            icon={comparePasswordIcon}
                            className={`${comparePasswordClass} mr-1`}
                          />
                          <span className={comparePasswordClass}>
                            {comparePasswordText}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="form-group no-margin">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        Reset Password
                      </button>
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
