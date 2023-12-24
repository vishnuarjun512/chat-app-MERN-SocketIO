import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import "./LoginRegister.css";
import { setUser } from "../redux/userSlice/userSlice";

const LoginRegister = () => {
  const [loginForm, setLoginForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [login, setLogin] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user.username);
  const userId = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    const container = document.querySelector(".container");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");

    if (container && registerBtn && loginBtn) {
      registerBtn.addEventListener("click", () => {
        container.classList.add("active");
      });

      loginBtn.addEventListener("click", () => {
        container.classList.remove("active");
      });
    }
  }, [loginForm, registerForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = login ? "login" : "register";

    try {
      const res = await axios.post(
        `/api/user/${url}`,
        login ? loginForm : registerForm
      );
      if (res.data.error) {
        setError(res.data.error);
        setTimeout(() => {
          setError(null);
        }, 2000);
        return;
      }
      console.log(res.data);
      dispatch(setUser(res.data.user, res.data.id));
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="body">
      <div className="container">
        <div className="form-container sign-up">
          <form
            onSubmit={(e) => {
              handleSubmit(e);
              setLogin(true);
            }}
          >
            <h1>Create Account</h1>
            <div className="social-icons">
              <a href="#" className="icon">
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            </div>
            <span>or use your email for Registration</span>
            <input
              onChange={(e) =>
                setRegisterForm({ ...registerForm, username: e.target.value })
              }
              type="text"
              placeholder="Name"
            />
            <input
              onChange={(e) =>
                setRegisterForm({ ...registerForm, email: e.target.value })
              }
              type="email"
              placeholder="Email"
            />
            <input
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password: e.target.value })
              }
              type="password"
              placeholder="Password"
            />
            <button
              onClick={() => {
                setLogin(false);
              }}
            >
              Register
            </button>
            {error && (
              <div
                style={{
                  color: "white",
                  marginTop: "8px",
                  backgroundColor: "red",
                  borderRadius: "10px",
                  padding: "5px",
                }}
              >
                {error}
              </div>
            )}
          </form>
        </div>
        <div className="form-container sign-in">
          <form
            onSubmit={(e) => {
              handleSubmit(e);
              setLogin(true);
            }}
          >
            <h1>Sign In</h1>
            <div className="social-icons">
              <a href="#" className="icon">
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            </div>
            <span>or use your email for Registration</span>

            <input
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  email: e.target.value,
                  username: e.target.value,
                })
              }
              type="text"
              placeholder="Email or Username"
            />
            <input
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              type="password"
              placeholder="Password"
            />
            <a href="#">Forgot your Password?</a>
            <button>Login</button>
            {error && (
              <div
                style={{
                  color: "white",
                  marginTop: "8px",
                  backgroundColor: "red",
                  borderRadius: "10px",
                  padding: "5px",
                }}
              >
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-pannel toggle-left">
              <h1>Welcome back!</h1>
              <p>Enter your personal details to use all of the site features</p>
              <button className="hidden" id="login">
                Login
              </button>
            </div>
            <div className="toggle-pannel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>
                Register with your personal details to use all of the site
                features
              </p>
              <button className="hidden" id="register">
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
