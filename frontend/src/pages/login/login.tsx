import { useState } from "react";
// import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Input } from "../../components/inputs/input";
import Button from "../../components/button/button";
import styles from "./login.module.css";

import type { RootState, AppDispatch } from "../../store/store";
import { login, logout } from "../../store/loginSlice";

type Mode = "client" | "admin";

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, isLoading } = useSelector((state: RootState) => state.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [mode, setMode] = useState<Mode>("client");
  const [formError, setFormError] = useState("");

  // one handler for both inputs, it uses the input's `name`
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
    setFormError("");
  };

  // admins go to the admin panel, everyone else to the home page
  const goToStart = (role: string) => {
    navigate(role === "admin" ? "/admin" : "/home", { replace: true });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      <section className={styles.card}>
        <h1 className={styles.cardHead}>Log in</h1>

        <div className={styles.body}>
          <h2 className={styles.title}>
            {mode === "admin" ? "Admin sign in" : "Welcome back to Vacancy"}
          </h2>
          <p className={styles.subtitle}>
            {mode === "admin"
              ? "Manage hotels, rooms and reservations."
              : "Sign in to book your next stay."}
          </p>

          {/* Guest / Admin switch */}
          <div
            className={styles.toggle}
            role="tablist"
            aria-label="Account type"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "client"}
              className={`${styles.toggleButton} ${
                mode === "client" ? styles.toggleActive : ""
              }`}
              onClick={() => changeMode("client")}
            >
              Guest
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "admin"}
              className={`${styles.toggleButton} ${
                mode === "admin" ? styles.toggleActive : ""
              }`}
              onClick={() => changeMode("admin")}
            >
              Admin
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              id="email"
              name="email"
              label="Email address"
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

            {message && (
              <p className={styles.error} role="alert">
                {message}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className={styles.submit}
            >
              {isLoading ? "Signing in..." : "Continue"}
            </Button>

            {/* Google is for guests only */}
            {mode === "client" && (
              <>
                <div className={styles.googleWrap}>
                  {/* <GoogleLogin
                    onSuccess={handleGoogle}
                    onError={() =>
                      setFormError("Google sign-in failed. Please try again.")
                    }
                    theme="outline"
                    shape="pill"
                    text="continue_with"
                    width="300"
                  /> */}
                </div>

                <div className={styles.divider}>
                  <span>or</span>
                </div>

                <p className={styles.switchText}>
                  New here?{" "}
                  <NavLink to="/register" className={styles.switchLink}>
                    Create an account
                  </NavLink>
                </p>
              </>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
