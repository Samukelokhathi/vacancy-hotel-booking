import { Input } from "../../components/Input/Input";
import styles from "./Register.module.css";
import Button from "../../components/Button/Button";
import { Text } from "../../components/Text/Text";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/Store";

import {
  setName,
  setSurname,
  setCellNumber,
  setNumber,
  setEmail,
  setPassword,
  setConfirmPassword,
  resetForm,
} from "../../store/registerSlice";

import { signup } from "../../store/Signup/SignUp";

function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const signUpData = useSelector((state: RootState) => state.signUp);
  const isLoading = signUpData.isLoading;
  const error = signUpData.error;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(signup(signUpData)).unwrap();

      dispatch(resetForm());
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.welcomeText}>
        <Text variant="h2" children={"Create your basket"} />
        <Text
          variant="p"
          children={"Your password is encrypted before it is ever stored."}
        />
      </div>

      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.nameSurnameContainer}>
          <Input
            id="Name"
            name="Name"
            label="Name"
            type="text"
            value={signUpData.name}
            onChange={(e) => dispatch(setName(e.target.value))}
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
