  import React, { useState } from "react";
  import "./styles.css";
  import Input from "../Input";
  import Button from "../Button";
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { toast } from "react-toastify";
  import { auth, db } from "../../firebase";
  import { useNavigate } from "react-router-dom";
  import { doc, getDoc, setDoc } from "firebase/firestore";
  import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
  import { provider } from "../../firebase";

  function SignupSigninComponent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loginForm, setLoginForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function signupWithEmail(event) {
      setLoading(true);
      event.preventDefault();
      console.log(name);
      console.log(email);
      console.log(password);
      console.log(confirmPassword);
      if (name != "" && email != "" && password != "" && confirmPassword != "") {
        if (password === confirmPassword) {
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed up
              const user = userCredential.user;
              console.log("user", user);
              toast.success("User Created!");
              setLoading(false);
              setConfirmPassword("");
              setName("");
              setEmail("");
              setPassword("");
              createDoc(user);
              navigate("/dashboard");
              // Create a doc with user id with the following id
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              toast.error(errorMessage);
              setLoading(false);
              // ..
            });
        } else {
          toast.error("Password and Confirm Password dont match");
          setLoading(false);
        }
      } else {
        toast.warning("All fields are mandatory!");
        setLoading(false);
      }
    }

    function loginUsingEmail(event) {
      setLoading(true);
      event.preventDefault();
      console.log(email);
      console.log(password);

      if (email != "" && password != "") {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            toast.success("User logged In!");
            console.log("User logged in", user);
            navigate("/dashboard");
            setLoading(false);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.warning("All fields are mandatory!");
        setLoading(false);
      }
    }

    async function createDoc(user) {
      setLoading(true);
      if (!user) return;

      const useRef = doc(db, "users", user.uid);
      const userData = await getDoc(useRef);

      if (!userData.exists()) {
        try {
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName ? user.displayName : name,
            email: user.email,
            photoURL: user.photoURL ? user.photoURL : "",
            createdAt: new Date(),
          });
          toast.success("Doc Created");
          setLoading(false);
        } catch (e) {
          toast.error(e.message);
          setLoading(false);
        }
      } else {
        // toast.error("Doc already exists!");
        setLoading(false);
      }
    }

    function googgleAuth() {
      setLoading(true);
      try {
        signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log("user>>", user);
            createDoc(user);
            setLoading(false);
            navigate("/dashboard");
            toast.success("User authenticated");
            // IdP data available using getAdditionalUserInfo(result)
            // ...
          })
          .catch((error) => {
            setLoading(false);
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage)
          });
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    }

    return (
      <>
        {loginForm ? (
          <div className="signup-wrapper">
            <h2 className="title">
              Login on <span style={{ color: "var(--theme)" }}>FinanceFlow.</span>
            </h2>
            <form>
              <Input
                type="email"
                label={"Email"}
                state={email}
                placeholder={"you@example.com"}
                setState={setEmail}
              />
              <Input
                type="password"
                label={"Password"}
                state={password}
                placeholder={"Password"}
                setState={setPassword}
              />

              <Button
                disabled={loading}
                text={loading ? "Loading..." : "Login using Email"}
                onClick={(e) => loginUsingEmail(e)}
              />
              <p className="p-login">or</p>
              <Button
                onClick={googgleAuth}
                text={loading ? "Loading..." : "Login with Google"}
                blue={true}
              />
              <p className="p-login" onClick={() => setLoginForm(!loginForm)}>
                Or Dont have an Account?{" "}
                <span style={{ color: "var(--theme)" }}>Click here</span>
              </p>
            </form>
          </div>
        ) : (
          <div className="signup-wrapper">
            <h2 className="title">
              Sign Up on{" "}
              <span style={{ color: "var(--theme)" }}>FinanceFlow.</span>
            </h2>
            <form>
              <Input
                label={"Full Name"}
                state={name}
                placeholder={"Full Name"}
                setState={setName}
              />
              <Input
                type="email"
                label={"Email"}
                state={email}
                placeholder={"you@example.com"}
                setState={setEmail}
              />
              <Input
                type="password"
                label={"Password"}
                state={password}
                placeholder={"Password"}
                setState={setPassword}
              />
              <Input
                type="password"
                label={"Confirm Password"}
                state={confirmPassword}
                placeholder={"Confirm Password"}
                setState={setConfirmPassword}
              />
              <Button
                disabled={loading}
                text={loading ? "Loading..." : "Signup using Email"}
                onClick={(e) => signupWithEmail(e)}
              />
              <p className="p-login">or</p>
              <Button
                onClick={googgleAuth}
                text={loading ? "Loading..." : "Signup with Google"}
                blue={true}
              />
              <p className="p-login" onClick={() => setLoginForm(!loginForm)}>
                Or Have an Account Already?{" "}
                <span style={{ color: "var(--theme)" }}>Click here</span>
              </p>
            </form>
          </div>
        )}
      </>
    );
  }

  export default SignupSigninComponent;
