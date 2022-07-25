import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TextField from "@mui/material/TextField";
import GoogleButton from "react-google-button";
import {
  getGoogleSignInResult,
  getUser,
  getUserId,
  getUserToken,
  logInWithEmailAndPassword,
  logoutUser,
  signInWithGoogle,
  signUpWithEmailAndPassword,
} from "../../../firebase/firebase";
import { AppState } from "../../../AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../other/Constants";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 1,
  boxShadow: 24,
};

export default function AuthModal({
  openAuthModal,
  setOpenAuthModal,
  authTab,
  setAuthTab,
}) {
  const { setLoading, notify } = AppState();

  const [signupUserName, setSignupUserName] = React.useState("");
  const [signupUserEmail, setSignupUserEmail] = React.useState("");
  const [signupUserPassword, setSignupUserPassword] = React.useState("");

  const [loginUserEmail, setLoginUserEmail] = React.useState("");
  const [loginUserPassword, setLoginUserPassword] = React.useState("");

  const navigate = useNavigate();

  const parseResult = async (result, action) => {
    if (result === "TRUE") {
      const token = await getUserToken();
      const uid = getUserId();

      // console.log("Token: ", token);
      // console.log("Id: ", uid);

      if (action === "SIGNUP_EMAIL_PASSWORD") {
        const response = await axios.post(
          `${BASE_URL}/user/insert?email=${signupUserEmail}&username=${signupUserName}&userId=${uid}`
        );

        const status = response.data.status;

        if (status === 200) {
          // console.log("Sucess");
          notify("Account created successfully!", "success");
        } else {
          notify("Unable to create account", "error");
        }
      } else if (action === "SIGNUP_GOOGLE") {
        console.log("Google");
        const user = getUser();
        //console.log("User: ", user);

        try {
          const response = await axios.post(
            `${BASE_URL}/user/insert?email=${user.email}&username=${user.displayName}&userId=${user.uid}`
          );
        } catch (e) {
          // NO-OP
        }

        notify("You are successfully logged in!", "success");
      } else {
        notify("You are successfully logged in!", "success");
      }

      localStorage.setItem("userInfo", JSON.stringify(token));
      navigate("/home");
    } else {
      notify(result, "error");
    }
  };

  const signUpUserWithEmailAndPassword = async () => {
    if (!signupUserName) {
      notify("Name cannot be blank", "error");
    } else if (!signupUserEmail) {
      notify("Email cannot be blank", "error");
    } else if (!signupUserPassword) {
      notify("Password cannot be blank", "error");
    } else {
      setLoading(true);
      const result = await signUpWithEmailAndPassword(
        signupUserName,
        signupUserEmail,
        signupUserPassword
      );
      parseResult(result, "SIGNUP_EMAIL_PASSWORD");
      setLoading(false);
    }
  };

  const loginUserWithEmailAndPassword = async () => {
    if (!loginUserEmail) {
      notify("Name cannot be blank", "error");
    } else if (!loginUserPassword) {
      notify("Password cannot be blank", "error");
    } else {
      setLoading(true);
      const result = await logInWithEmailAndPassword(
        loginUserEmail,
        loginUserPassword
      );
      parseResult(result, "LOGIN_EMAIL_PASSWORD");
      setLoading(false);
    }
  };

  const signInUserWithGoogle = async () => {
    setLoading(true);
    await signInWithGoogle();
    const result = getGoogleSignInResult();
    //console.log(`Result: ${result}`);
    parseResult(result, "SIGNUP_GOOGLE");
    setLoading(false);
  };

  const handleChange = (event, newValue) => {
    setAuthTab(newValue);
  };

  const handleClose = () => setOpenAuthModal(false);

  return (
    <div>
      <Modal open={openAuthModal} onClose={handleClose}>
        <Box className="auth-modal" sx={style}>
          <TabContext value={authTab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                variant="fullWidth"
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab style={{ fontWeight: 600 }} label="Login" value="1" />
                <Tab style={{ fontWeight: 600 }} label="Sign Up" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <TextField
                id="loginEmail"
                label="Email"
                variant="outlined"
                fullWidth
                style={{ marginTop: 15 }}
                onChange={(e) => setLoginUserEmail(e.target.value)}
              />

              <TextField
                id="loginPassword"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                style={{ marginTop: 15 }}
                onChange={(e) => setLoginUserPassword(e.target.value)}
              />

              <button
                onClick={() => loginUserWithEmailAndPassword()}
                className="writerai-button auth-modal__button"
              >
                Login
              </button>

              <GoogleButton
                label="Login with Google"
                style={{
                  margin: "10px auto",
                  width: "100%",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                }}
                onClick={() => signInUserWithGoogle()}
              />
            </TabPanel>

            <TabPanel value="2">
              <TextField
                id="signupFullName"
                label="Full Name"
                variant="outlined"
                fullWidth
                onChange={(e) => setSignupUserName(e.target.value)}
              />

              <TextField
                id="signupEmail"
                label="Email"
                variant="outlined"
                fullWidth
                style={{ marginTop: 15 }}
                onChange={(e) => setSignupUserEmail(e.target.value)}
              />

              <TextField
                id="signupPassword"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                style={{ marginTop: 15 }}
                onChange={(e) => setSignupUserPassword(e.target.value)}
              />

              <button
                onClick={() => signUpUserWithEmailAndPassword()}
                className="writerai-button auth-modal__button"
              >
                Sign up
              </button>

              <GoogleButton
                label="Sign up with Google"
                style={{
                  margin: "10px auto",
                  width: "100%",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                }}
                onClick={() => signInUserWithGoogle()}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Modal>
    </div>
  );
}
