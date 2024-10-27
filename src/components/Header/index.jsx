import React, { useEffect } from "react";
import "./styles.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, signOut } from "firebase/auth";
import defaultImg from "../../assets/user.svg";
import finacSyncLogo from "../../assets/finansync.png";
function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);
  function logoutFnc() {
    try {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          toast.success("Loggeed out Successfully!");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }
  return (
    <div className="navbar">
      <div className="fin-logo">
        <img
          src={finacSyncLogo}
          alt=""
          style={{ borderRadius: "15%", height: "2.5rem", width: "2.5rem" }}
        />
        <p className="logo">FinanSync.</p>
      </div>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img
            src={user.photoURL ? user.photoURL : defaultImg}
            alt=""
            style={{ borderRadius: "15%", height: "1.4rem", width: "1.4rem" }}
          />
          <p className="logo link" onClick={logoutFnc}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
}

export default Header;
