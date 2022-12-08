import React, { useEffect, useRef, useState } from "react";
import { Button, Loader, Group } from "@mantine/core";
import "./otp-style.css";
import useCountdown from "./count-down-fun";
import { IconSend } from "@tabler/icons";
// import Countdown from "react-countdown";

// import CountDown from "../count-down/count-down";

const OTP = ({
  submitCode,
  changeConfirmStatus,
  error,
  clearCodeStatus,
  submitLoader,
  submitPh,
}) => {
  const endTime = new Date().getTime() + 60000; // 2 minutes
  const [timeLeft, setEndTime] = useCountdown(endTime);

  // const minutes = Math.floor(timeLeft / 60000) % 60;
  const seconds = Math.floor(timeLeft / 1000) % 60;

  const [codes, setCodes] = useState({
    first: "",
    second: "",
    third: "",
    fourth: "",
    fifth: "",
    sixth: "",
  });
  const first = useRef(null);
  const second = useRef(null);
  const third = useRef(null);
  const fourth = useRef(null);
  const fifth = useRef(null);
  const sixth = useRef(null);

  const keyChange = (e, position) => {
    if (e.target.value.length > 1) {
      setCodes((current) => ({
        ...current,
        [position]: e.target.value.slice(-1),
      }));
    } else if (!e.target.value) {
      backspace(position);
    } else {
      setCodes((current) => ({
        ...current,
        [position]: e.target.value,
      }));
      switch (position) {
        case "first":
          second.current.focus();
          break;
        case "second":
          third.current.focus();
          break;
        case "third":
          fourth.current.focus();
          break;
        case "fourth":
          fifth.current.focus();
          break;
        case "fifth":
          sixth.current.focus();

          break;

        default:
          return;
      }
    }
  };

  const backspace = (position) => {
    switch (position) {
      case "first":
        setCodes((current) => ({
          ...current,
          first: "",
        }));
        break;
      case "second":
        setCodes((current) => ({
          ...current,
          second: "",
        }));
        first.current.focus();
        break;
      case "third":
        setCodes((current) => ({
          ...current,
          third: "",
        }));
        second.current.focus();
        break;
      case "fourth":
        setCodes((current) => ({
          ...current,
          fourth: "",
        }));
        third.current.focus();
        break;
      case "fifth":
        setCodes((current) => ({
          ...current,
          fifth: "",
        }));
        fourth.current.focus();
        break;
      case "sixth":
        setCodes((current) => ({
          ...current,
          sixth: "",
        }));
        fifth.current.focus();
        break;
      default:
        return;
    }
  };

  const keyUp = (e, position) => {
    if (e.keyCode === 8) {
      if (position === 2 && codes.second.length === 0) {
        first.current.focus();
      } else if (position === 3 && codes.third.length === 0) {
        second.current.focus();
      } else if (position === 4 && codes.fourth.length === 0) {
        third.current.focus();
      } else if (position === 5 && codes.fifth.length === 0) {
        fourth.current.focus();
      } else if (position === 6 && codes.sixth.length === 0) {
        fifth.current.focus();
      }
    }
  };

  const getLogginedIn = () => {
    let code =
      codes.first +
      codes.second +
      codes.third +
      codes.fourth +
      codes.fifth +
      codes.sixth;

    // changeConfirmCode(code);

    changeConfirmStatus("");
    submitCode(code);
  };

  useEffect(() => {
    if (clearCodeStatus) {
      setCodes({
        first: "",
        second: "",
        third: "",
        fourth: "",
        fifth: "",
        sixth: "",
      });
    }
  }, [clearCodeStatus]);
  return (
    <div className="otp-container">
      <div className="userInput">
        <input
          type="number"
          maxLength={1}
          className="otp-input"
          ref={first}
          value={codes.first}
          onChange={(e) => keyChange(e, "first")}
          style={{
            border: `1px solid ${error.length ? "red" : "black"}`,
          }}
          // onKeyUp={(e) => keyUp(e, 1)}
        />
        <input
          type="number"
          maxLength={1}
          style={{
            border: `1px solid ${error.length ? "red" : "black"}`,
          }}
          className="otp-input"
          ref={second}
          value={codes.second}
          onChange={(e) => keyChange(e, "second")}
          onKeyUp={(e) => keyUp(e, 2)}
        />
        <input
          type="number"
          style={{
            border: `1px solid ${error.length ? "red" : "black"}`,
          }}
          maxLength={1}
          className="otp-input"
          ref={third}
          value={codes.third}
          onChange={(e) => keyChange(e, "third")}
          onKeyUp={(e) => keyUp(e, 3)}
        />
        <input
          type="number"
          style={{
            border: `1px solid ${error.length ? "red" : "black"}`,
          }}
          maxLength={1}
          className="otp-input"
          ref={fourth}
          value={codes.fourth}
          onChange={(e) => keyChange(e, "fourth")}
          onKeyUp={(e) => keyUp(e, 4)}
        />
        <input
          type="number"
          style={{
            border: `1px solid ${error ? "red" : "black"}`,
          }}
          maxLength={1}
          value={codes.fifth}
          className="otp-input"
          ref={fifth}
          onChange={(e) => keyChange(e, "fifth")}
          onKeyUp={(e) => keyUp(e, 5)}
        />
        <input
          type="number"
          style={{
            border: `1px solid ${error ? "red" : "black"}`,
          }}
          maxLength={1}
          value={codes.sixth}
          className="otp-input"
          ref={sixth}
          onChange={(e) => keyChange(e, "sixth")}
          onKeyUp={(e) => keyUp(e, 6)}
        />
      </div>
      {/* <CountDown submitPh={submitPh} /> */}
      <Group
        noWrap
        style={{
          margin: "0 20px",
          // background: "cyan",
          justifyContent: "center",
        }}
      >
        <span>ကုဒ်မရဘူးလား</span>
        {seconds ? (
          <span style={{ color: "green", marginTop: "-4px" }}>{seconds}</span>
        ) : (
          <Button
            rightIcon={<IconSend />}
            variant="subtle"
            color="cyan"
            onClick={() => {
              submitPh();
              setEndTime(endTime);
            }}
          >
            Resend
          </Button>
        )}
      </Group>
      {/* <Button onClick={() => timeControl(true)}>Start</Button> */}
      <div
        style={{
          padding: "0 10px",
        }}
      >
        <Button
          my={15}
          fullWidth
          color="green"
          size="lg"
          onClick={getLogginedIn}
          disabled={submitLoader}
        >
          {/* အတည်ပြုမည် */}
          {submitLoader ? <Loader color="black" /> : "အတည်ပြုမည်"}
        </Button>
      </div>
    </div>
  );
};

export default OTP;
