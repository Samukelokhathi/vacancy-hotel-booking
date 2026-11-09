import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { logout } from "../../store/loginSlice";
import { MenuIcon, UserIcon } from "../icons/icons";
import styles from "./userMenu.module.css";

// The account button in the navbar and its dropdown
export default function UserMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.login,
  );
  const isAdmin = user?.role === "admin";
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close on outside click or Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const goTo = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsOpen(false);
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const userInitial = user?.name?.trim().charAt(0).toUpperCase();

  return (
    <div className={styles.menuWrapper} ref={menuRef}>
      <button
        type="button"
        className={styles.menuButton}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Account menu"
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
      >
        <MenuIcon size={16} />
        <span className={styles.avatar}>
          {isAuthenticated && userInitial ? (
            userInitial
          ) : (
            <UserIcon size={18} />
          )}
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          {isAuthenticated ? (
            <>
              <p className={styles.greeting}>Hi, {user?.name}</p>
              <button role="menuitem" onClick={() => goTo("/profile")}>
                Profile
              </button>
              <button role="menuitem" onClick={() => goTo("/bookings")}>
                My bookings
              </button>
              {isAdmin && (
                <button role="menuitem" onClick={() => goTo("/admin")}>
                  Admin dashboard
                </button>
              )}
              <hr />
              <button role="menuitem" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                role="menuitem"
                className={styles.emphasised}
                onClick={() => goTo("/register")}
              >
                Sign up
              </button>
              <button role="menuitem" onClick={() => goTo("/login")}>
                Log in
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
