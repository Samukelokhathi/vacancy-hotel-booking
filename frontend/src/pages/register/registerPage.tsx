import { Input } from "../../components/inputs/input";
import Button from "../../components/button/button";
import styles from "./registerPage.module.css";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";

import {
  setField,
  resetForm,
  registerUser,
  type RegisterFormData,
} from "../../store/registerSlice";

function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const signUpData = useSelector((state: RootState) => state.register);
  const { isLoading, error } = signUpData;

  // gives an Input its value and onChange
  const field = (name: keyof RegisterFormData) => ({
    value: signUpData[name],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      dispatch(setField({ field: name, value: event.target.value })),
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await dispatch(registerUser(signUpData)).unwrap();

      dispatch(resetForm());
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.cardHead}>Sign up</h1>

        <div className={styles.body}>
          <h2 className={styles.title}>Welcome to Vacancy</h2>
          <p className={styles.subtitle}>
            Create an account to book hotels and manage your stays.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <Input
                id="name"
                name="name"
                label="Name"
                type="text"
                {...field("name")}
                required
              />
              <Input
                id="surname"
                name="surname"
                label="Surname"
                type="text"
                {...field("surname")}
                required
              />
            </div>

            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              {...field("email")}
              required
            />

            <Input
              id="cellphone"
              name="cellphone"
              label="Cell number"
              type="tel"
              {...field("cellphone")}
              required
            />

            <div className={styles.row}>
              <Input
                id="password"
                name="password"
                label="Password"
                type="password"
                {...field("password")}
                required
              />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm password"
                type="password"
                {...field("confirmPassword")}
                required
              />
            </div>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className={styles.submit}
            >
              {isLoading ? "Creating account..." : "Agree and continue"}
            </Button>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <p className={styles.switchText}>
              Already have an account?{" "}
              <NavLink to="/login" className={styles.switchLink}>
                Log in
              </NavLink>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Register;
