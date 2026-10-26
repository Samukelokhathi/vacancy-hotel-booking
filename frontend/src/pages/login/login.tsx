import { Input } from "../../components/inputs/input";
import Button from "../../components/button/button";
import styles from "../login/login.module.css";

import { NavLink, useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store/store";
import { login } from "../../store/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, isLoading } = useSelector((state: RootState) => state.login);

  const [form, setForm] = useState({ email: "", password: "" });

  // one handler for both inputs, it uses the input's `name`
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(login(form)).unwrap();
      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <NavLink to="/home" className={styles.logo}>
          Vacancy Hotels
        </NavLink>

        <div className={styles.welcomeText}>
          <h2 className={styles.title}>Welcome back</h2>
          <p className={styles.subtitle}>Sign in to book your next stay.</p>
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

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <p className={styles.registerText}>
            New here?{" "}
            <NavLink to="/register" className={styles.registerLink}>
              Create an account
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;