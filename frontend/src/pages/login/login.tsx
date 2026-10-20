import { Input } from "../../components/inputs/input";
import styles from "./Login.module.css";
import Button from "../../components/button/button";
import { Text } from "../../components/text/text";
import loginImg from "./images/istockphoto-1660821332-612x612.jpg";

import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store/store";
import { login } from "../../store/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.login);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(
        login({
          email,
          password,
        }),
      ).unwrap();

      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className={styles.page}>
      <img src={loginImg} alt="" />
      <div className={styles.loginContainer}>
        <div className={styles.welcomeText}>
          <Text variant="h2" children={"Welcome back"} />
          <Text
            variant="p"
            children={"Sign in to pick up your shopping where you left off."}
          />
        </div>
        <form className={styles.card} onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            label="Email Address"
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
          {auth.error && <p className={styles.error}>{auth.error}</p>}
          <Button type="submit">Sign in</Button>
          <p className={styles.registerText}>
            New here?{" "}
            <NavLink to={"/register"} className={styles.registerLink}>
              Create an account+
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
