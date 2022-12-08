import React, { useState, useEffect, useRef } from "react";
import Logo from "./logo.svg";
import { useStyles } from "./login-style";
import { TextInput, Button, Group, Loader } from "@mantine/core";
import dayjs from "dayjs";
import { DatePicker } from "@mantine/dates";
import CountrySelect from "../component/country_select";
import { authetication } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import io from "socket.io-client";
import axios from "axios";
import OTP from "../component/otp/otp";

// import { useNavigate } from "react-router-dom";

import { getAuth, updateProfile, getIdToken } from "firebase/auth";

const auth = getAuth();
// console.log("o", auth.currentUser);
// const socket = io.connect("/");
// const socket = io.connect("ws://localhost:5000");

const Login = () => {
  // const navigate = useNavigate();
  const { classes } = useStyles();
  const [phNo, setPhNo] = useState("");
  const [phStatusWrong, changePhStatusWrong] = useState(false);
  const [phLoading, setPhLoading] = useState(false);
  const [page, setPage] = useState(0);
  // const [confirmCode, setConfirmCode] = useState("");
  const [confirmCodeError, setConfirmCodeError] = useState("");
  const [countryCode, setCountryCode] = useState("+95");
  const [phErrMessage, setPhErrMessage] = useState("");
  const [recaptcha, setRecaptcha] = useState();
  const [clearCodeStatus, setClearCode] = useState(false);

  // Loader
  const [submitLoader, setSubmitLoader] = useState(false);
  const [profileLoader, setProfileLoader] = useState(false);

  const [name, changeName] = useState("");

  const [profileError, changeProfileError] = useState("");

  const [token, setToken] = useState();

  const dateRef = useRef(null);

  useEffect(() => {
    const verifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        // callback: (response) => {},
      },
      authetication
    );
    if (!recaptcha) {
      verifier.verify().then(() => setRecaptcha(verifier));
    }
  }, [recaptcha]);

  const checkNumberOnly = (trim) => {
    const reg = new RegExp("^[0-9]+$");
    if (!reg.test(trim)) {
      return true;
    } else {
      return false;
    }
  };

  const changePhField = (e) => {
    let trim = e.target.value.trim();
    checkNumberOnly(trim)
      ? changePhStatusWrong(true)
      : changePhStatusWrong(false);
    setPhNo(e.target.value);
  };

  const submitPh = () => {
    setClearCode(false);
    let ph_number = countryCode + phNo;
    setPhLoading(true);
    // console.log("submitted", ph_number);
    signInWithPhoneNumber(authetication, ph_number, recaptcha)
      .then((confirmationResult) => {
        // console.log("confirmation Result", confirmationResult);
        window.confirmationResult = confirmationResult;
        setPage(1);
        changePhStatusWrong(false);
        setPhErrMessage("");
        setPhLoading(false);
        // setPhNo("");
        // recaptcha.clear();
      })

      .catch((error) => {
        // console.log("error", error.message);
        setPhLoading(false);
        if (
          error.message.includes("auth/internal-error") ||
          error.message.includes("auth/too-many-requests")
        ) {
          setPhErrMessage(
            "codeပို့ရန်လုပ်ဆောင်မှူမအောင်မြင်ပါ။ နောက်၂မိနစ်နေမှပြန်လည်ကြိုးစားပေးပါ"
          );
        } else {
          setPhErrMessage("မှန်ကန်သောဖုန်းနံပါတ်ကိုပြန်ထည့်ပါ");
        }
        // if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
        if (recaptcha) recaptcha.clear();
        setPage(0);
        changePhStatusWrong(true);

        return;
      });
  };

  const submitCode = async (code) => {
    try {
      // setPage(2);

      let confirmationResult = window.confirmationResult;
      // console.log("p", ph_number, code);

      const result = await confirmationResult.confirm(code);
      const user = result.user;
      console.log("user", user.uid, user);

      setSubmitLoader(true);
      const request = await axios.post("http://localhost:3001/auth", {
        uid: user.uid,
      });

      if (request.status === 200) {
        setToken(request.data.token);
        getIdToken(auth.currentUser)
          .then((idToken) => {
            console.log("idToken", idToken);
          })
          .catch((error) => {
            console.log("idtoken error", error);
          });

        setSubmitLoader(false);
        const user_info = await axios.post("http://localhost:3001/user/info", {
          phone_no: countryCode + phNo,
        });
        // console.log("no_name", request.data.no_name);
        // console.log(
        //   "check",
        //   request.data.no_name && user_info.data.data.length
        // );

        if (!request.data.no_name && user_info.data.data.length === 0) {
          setPage(2);
        } else {
          console.log("success");
          window.Print.postMessage(request.data.token);

          setConfirmCodeError("");
        }
      }
    } catch (e) {
      console.log("submit error", e.message);
      if (e.message.includes("invalid-verification-code")) {
        // setConfirmStatus(true);
        setConfirmCodeError("codeမှားနေပါတယ်");
      }
      setSubmitLoader(false);
    }
  };

  const changePhNo = () => {
    setPhNo("");
    setPage(0);
    setClearCode(true);
    setConfirmCodeError("");
  };

  const submitData = () => {
    try {
      // const format_date = dateRef.ctoISOString().slice(0, 10);
      // console.log(format_date, date.toISOString());
      // console.log(dateRef.current);

      const phone_no = countryCode + phNo;
      if (name.length && dateRef.current.value.length) {
        let dob = new Date(dateRef.current.value).toLocaleDateString("zh");
        setProfileLoader(true);

        updateProfile(auth.currentUser, {
          displayName: name,
        })
          .then(async () => {
            axios
              .post("http://localhost:3001/user/register", {
                dob,
                phone_no,
                name,
                firebase_id: auth.currentUser.uid,
              })
              .then(function(response) {
                // console.log(response);
                setProfileLoader(false);
                changeProfileError("");
                console.log("success");
                window.Print.postMessage(token);
              })
              .catch(function(error) {
                console.log(error);
              });
            // console.log(auth.currentUser, auth.currentUser.displayName);
            // setProfileLoader(false);
            // changeProfileError("");

            // window.Print.postMessage(token);
            // console.log("success");
          })
          .catch((error) => {
            console.log(error);
            setProfileLoader(false);
            changeProfileError("စစ်မှန်သောအချက်အလက်ထည့်ပေးပါ");
          });
      } else {
        changeProfileError("data အကုန်ဖြည့်ပေးပါ");
      }
    } catch (_) {
      changeProfileError("data အကုန်ဖြည့်ပေးပါ");
    }
  };

  return (
    <div className={classes.container}>
      <img src={Logo} alt="React Logo" width={150} height={150} />

      {page === 0 && (
        <div
          style={{
            padding: "50px",
          }}
        >
          <p style={{ color: "red" }}>{phErrMessage}</p>
          <Group noWrap>
            <CountrySelect
              countryCode={countryCode}
              changeCountryCode={setCountryCode}
            />

            <TextInput
              // label="Your Phone Number"
              type="number"
              placeholder="9123456789"
              iconWidth={65}
              size="lg"
              value={phNo}
              onChange={changePhField}
              error={phStatusWrong}
              // icon={<span style={{ color: "green" }}>{countryCode}</span>}
            />
          </Group>
          <Button
            my={30}
            fullWidth
            color="green"
            size="lg"
            disabled={phStatusWrong || phNo.length < 5 || phLoading}
            onClick={submitPh}
          >
            {phLoading ? <Loader color="black" /> : "အကောင့်ဝင်မည်"}
          </Button>
        </div>
      )}
      {page === 1 && (
        <div>
          <span style={{ margin: "50px 20px", color: "red" }}>
            {confirmCodeError}
          </span>
          <OTP
            // changeConfirmCode={setConfirmCode}
            changeConfirmStatus={setConfirmCodeError}
            submitCode={submitCode}
            error={confirmCodeError}
            clearCodeStatus={clearCodeStatus}
            clearCode={setClearCode}
            submitLoader={submitLoader}
            submitPh={submitPh}
          />
          {}

          <Button fullWidth variant="subtle" onClick={changePhNo}>
            ဖုန်းနံပါတ် ပြောင်းမည်
          </Button>
        </div>
      )}

      {page === 2 && (
        <div>
          <p
            style={{
              margin: "20px 0",
              color: "red",
            }}
          >
            {profileError}
          </p>

          <TextInput
            placeholder="Your name"
            label="Full name"
            withAsterisk
            size="lg"
            value={name}
            required
            disabled={profileLoader}
            onChange={(e) => changeName(e.target.value)}
          />
          <DatePicker
            // fullWidth
            my={10}
            size="lg"
            placeholder="Date of Birth"
            label="မွေးနေ့"
            disabled={profileLoader}
            withAsterisk
            required
            // value={date}
            ref={dateRef}
            maxDate={dayjs(new Date()).toDate()}
          />
          {/* <CountDown /> */}
          <Button
            my={30}
            fullWidth
            color="black"
            size="lg"
            // disabled={profileLoader}
            onClick={submitData}
            // onClick={insert_user_info}
          >
            {profileLoader ? <Loader color="black" /> : "အတည်ပြုမည်"}
          </Button>
        </div>
      )}
      <div id="recaptcha-container" />
    </div>
  );
};

export default Login;
