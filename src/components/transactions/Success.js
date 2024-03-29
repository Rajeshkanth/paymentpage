import React, { memo, useContext, useEffect, useState } from "react";
import axios from "axios";
import { store } from "../../App";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router";
import Loader from "../utils/Loader";

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
    if (connectionMode === "socket") {
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
      const paymentConfirmed = () => {};
      try {
        const response = await axios.post(
          `http://localhost:8080/api/transaction/transactionStatus/${tabId}`
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
          <div className="bg-gray-700 h-screen w-screen text-white flex flex-col items-center justify-center font-poppins space-y-2">
            <div class="bg-gray-700 width-screen flex justify-center items-center">
              <MdOutlineCancel className="text-4xl" />
            </div>
            <h3>Payment transaction failed !</h3>
            <p>Redirecting to the home page....</p>
          </div>
        </>
      ) : (
        <>
          {check ? (
            <div className="bg-gray-700 h-screen w-screen flex flex-col items-center justify-center text-white font-poppins">
              <div class="bg-gray-700 width-screen flex justify-center items-center">
                <svg
                  class="checkmark w-14 h-14 rounded-full block border-2 border-white  mx-auto my-10"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    class="checkmark__circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />{" "}
                  <path
                    class="checkmark__check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
              <h3>Payment transaction successful !</h3>
              <br />
            </div>
          ) : (
            <Loader msg={"Your transaction is processing"} />
          )}
        </>
      )}
    </>
  );
}

export default memo(Success);
