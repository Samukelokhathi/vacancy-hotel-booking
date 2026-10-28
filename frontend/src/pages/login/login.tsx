import { useState } from "react";
// import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Input } from "../../components/inputs/input";
import Button from "../../components/button/button";
import VideoBackground from "../../components/videoBackround/videoBackground";
import styles from "../login/login.module.css";

import type { RootState, AppDispatch } from "../../store/store";
import { login, logout } from "../../store/loginSlice";
import videoSrc from "../../../public/videos/A hotel entrance video showing the exterior entrance of a hotel, with the entrance and surrounding facade as the main focus..mp4";

type Mode = "client" | "admin";

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, isLoading } = useSelector((state: RootState) => state.login);
  0;
  const [form, setForm] = useState({ email: "", password: "" });
  const [mode, setMode] = useState<Mode>("client");
  const [formError, setFormError] = useState("");

  // one handler for both inputs, it uses the input's `name`
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
    setFormError("");
  };

  // admins go to the admin panel, everyone else to the home page
  const goToStart = (role: string) => {
    navigate(role === "admin" ? "/admin" : "/home", { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    try {
      const user = await dispatch(login(form)).unwrap();

      // the Admin tab only lets real admins in
      if (mode === "admin" && user.role !== "admin") {
        dispatch(logout());
        setFormError("This account is not an admin account.");
        return;
      }

      goToStart(user.role);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // const handleGoogle = async (response: CredentialResponse) => {
  //   setFormError("");

  //   if (!response.credential) {
  //     setFormError("Google sign-in failed. Please try again.");
  //     return;
  //   }

  //   try {
  //     const user = await dispatch(googleLogin(response.credential)).unwrap();
  //     goToStart(user.role);
  //   } catch (error) {
  //     console.error("Google login failed:", error);
  //   }
  // };

  const message = formError || error;

  return (
    <div className={styles.page}>
      {/* the file lives in public/videos, so the address starts with /videos */}
      <VideoBackground src={videoSrc} />

      <div className={styles.container}>
        <NavLink to="/home" className={styles.logo}>
          Vacancy Hotels
        </NavLink>

        <div className={styles.welcomeText}>
          <h2 className={styles.title}>
            {mode === "admin" ? "Admin sign in" : "Welcome back"}
          </h2>
          <p className={styles.subtitle}>
            {mode === "admin"
              ? "Manage hotels, rooms and reservations."
              : "Sign in to book your next stay."}
          </p>
        </div>

        {/* Guest / Admin switch */}
        <div className={styles.toggle}>
          <button
            type="button"
            className={`${styles.toggleButton} ${
              mode === "client" ? styles.toggleActive : ""
            }`}
            onClick={() => changeMode("client")}
          >
            Guest
          </button>
          <button
            type="button"
            className={`${styles.toggleButton} ${
              mode === "admin" ? styles.toggleActive : ""
            }`}
            onClick={() => changeMode("admin")}
          >
            Admin
          </button>
        </div>

        <form className={styles.card} onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {message && <p className={styles.error}>{message}</p>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          {/* Google is for guests only */}
          {mode === "client" && (
            <>
              <div className={styles.divider}>
                <span>or</span>
              </div>

              <div className={styles.googleWrap}>
                {/* <GoogleLogin
                  onSuccess={handleGoogle}
                  onError={() =>
                    setFormError("Google sign-in failed. Please try again.")
                  }
                  theme="filled_black"
                  shape="pill"
                  text="continue_with"
                  width="300"
                /> */}
              </div>

              <p className={styles.registerText}>
                New here?{" "}
                <NavLink to="/register" className={styles.registerLink}>
                  Create an account
                </NavLink>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
