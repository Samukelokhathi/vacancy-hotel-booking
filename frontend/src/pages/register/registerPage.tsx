import { Input } from "../../components/inputs/input";
import styles from "./registerPage.module.css";
import Button from "../../components/button/button";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";

import {
  setField,
  resetForm,
  registerUser,
  type RegisterFormData,
} from "../../store/registerSlice";

import { registerUser } from "../../store/registerSlice";

function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const signUpData = useSelector((state: RootState) => state.register);
  const isLoading = signUpData.isLoading;
  const error = signUpData.error;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(registerUser(signUpData)).unwrap();

      dispatch(resetForm());
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.nameSurnameContainer}>
          <Input
            id="Name"
            name="Name"
            label="Name"
            type="text"
            value={signUpData.name}
            onChange={(e) => dispatch(setField({ field: "name", value: e.target.value }))}
            style={{ width: 240 }}
            required
          />
          <Input
            id="Surname"
            name="Surname"
            label="Surname"
            type="text"
            value={signUpData.surname}
            onChange={(e) => dispatch(setSurname(e.target.value))}
            style={{ width: 240 }}
            required
          />
        </div>
        <Input
          id="email"
          name="Email"
          label="Email"
          type="email"
          value={signUpData.email}
          onChange={(e) => dispatch(setEmail(e.target.value))}
          required
        />
        <Input
          id="Cell number"
          name="Cell number"
          label="Cell number"
          type="text"
          value={signUpData.number}
          onChange={(e) => dispatch(setNumber(e.target.value))}
          required
        />
        <div className={styles.passwordContainer}>
          <Input
            id="Password"
            name="Password"
            label="Password"
            type="password"
            value={signUpData.password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
            style={{ width: 240 }}
            required
          />

          <Input
            id="Confirm password"
            name="Confirm password"
            label="Confirm password"
            value={signUpData.confirmPassword}
            type="password"
            onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
            style={{ width: 240 }}
            required
          />
        </div>
        {error && <p>{error}</p>}

        <Button type="submit" disabled={isLoading}>
          Sign up
        </Button>

        <p className={styles.registerText}>
          Already registered?{" "}
          <NavLink to={"/"} className={styles.registerLink}>
            Sign in
          </NavLink>
        </p>
      </form>
    </div>
  );
}

export default Register;
