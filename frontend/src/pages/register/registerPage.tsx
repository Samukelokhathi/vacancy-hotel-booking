import { Input } from "../../components/inputs/input";
import Button from "../../components/button/button";
import styles from "../register/registerPage.module.css";
import VideoBackground from "../../components/videoBackround/videoBackground";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import videoSrc from "../../../public/videos/hotel_promo.mp4";

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
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch(setField({ field: name, value: e.target.value })),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      <VideoBackground src={videoSrc} />

      <div className={styles.container}>
        <NavLink to="/home" className={styles.logo}>
          Vacancy Hotels
        </NavLink>

        <div className={styles.welcomeText}>
          <h2 className={styles.title}>Create your account</h2>
          <p className={styles.subtitle}>
            Register to book hotels and manage your stays.
          </p>
        </div>

        <form className={styles.card} onSubmit={handleSubmit}>
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

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>

          <p className={styles.registerText}>
            Already registered?{" "}
            <NavLink to="/login" className={styles.registerLink}>
              Sign in
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
