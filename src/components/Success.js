import React, { memo, useContext, useEffect, useState } from "react";
import axios from "axios";
import { store } from "../App";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router";
import Loader from "./Loader";
import ConfirmTick from "./images/ConfirmTick";

function Success() {
  const { socket, connectionMode } = useContext(store);
  const [check, setCheck] = useState(false);
  const [fail, setFail] = useState(false);
  const navigate = useNavigate();
  let sessionId;

  useEffect(() => {
    sessionId = sessionStorage.getItem("tabId");
    socket.emit("successPage", {
      socketRoom: sessionId,
    });
    const handleSuccess = (data) => {
      if (typeof data === "boolean") {
        setCheck(data);
        setFail(false);
        console.log("success");
      }
    };
    const handleFailure = (data) => {
      if (typeof data === "boolean") {
        setFail(data);
        setCheck(false);
      }
    };
    socket.on("success", handleSuccess);
    socket.on("failed", handleFailure);
    return () => {
      socket.off("success", handleSuccess);
      socket.off("failed", handleFailure);
    };
  }, [socket]);

  useEffect(() => {
    if (connectionMode !== "socket") {
    } else {
      socket.on("paymentConfirmAlert", (data) => {
        const receivedRoom = data.socketRoom;
        console.log(receivedRoom);
        socket.join(receivedRoom);
      });
    }
  }, [socket, connectionMode]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const tabId = sessionStorage.getItem("tabId");
      try {
        const response = await axios.post(
          `http://localhost:8080/success/${tabId}`
        );

        if (response.status === 200) {
          setCheck(true);
          setFail(false);
        }
        if (response.status === 201) {
          setCheck(false);
          setFail(true);
        }
      } catch (err) {
        console.log(err);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [check, fail]);

  useEffect(() => {
    if (check || fail === true) {
      setTimeout(() => {
        navigate("/transferPage");
      }, 3000);
    }
  }, [check, fail, navigate]);

  return (
    <>
      {fail ? (
        <>
          {" "}
          <div className="loading h-screen w-screen flex flex-col items-center justify-center font-poppins space-y-2">
            <div class="wrapper width-screen flex justify-center items-center">
              <MdOutlineCancel className="fail-icon" />{" "}
            </div>
            <h3 className="text-white">Payment Transaction Failed!</h3>
            <p className="text-white">Redirecting to the home page....</p>
          </div>
        </>
      ) : (
        <>
          {check ? (
            <div className="loading h-screen  w-screen flex flex-col items-center justify-center font-poppins">
              <div class="wrapper width-screen flex justify-center items-center">
                <ConfirmTick />
              </div>
              <h3 className="text-white">Payment Transaction Successful !</h3>
              <br />
            </div>
          ) : (
            <Loader msg={"Your Transaction is processing"} />
          )}
        </>
      )}
    </>
  );
}

export default memo(Success);
