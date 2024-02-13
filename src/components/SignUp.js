import React, { useContext, useState, useEffect, memo } from "react";
import { store } from "../App";
import axios from "axios";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import logo from "./images/Greenwhitelogo2.png";

function SignUp() {
  const {
    createPassword,
    confirmPassword,
    handleConfirmPassword,
    handleCreatePassword,
    handleRegMobileNumber,
    regMobileNumber,
    setRegMobileNumber,
    setCreatePassword,
    setConfirmPassword,
    registeredUsers,
    userName,
    setLoggedUser,
    windowWidth,
    setWindowWidth,
    connectionMode,
    socket,
    isLogin,
    setIsLogin,
    passwordError,
    setPasswordError,
    setHasLowerCase,
    setHasMinLength,
    setHasSpecialChar,
    setHasUpperCase,
    hasLowerCase,
    hasUpperCase,
    hasSpecialChar,
    hasMinLength,
  } = useContext(store);

  //   const [isLogin, setIsLogin] = useState(true);
  const [allInputAlert, setAllInputAlert] = useState(false);
  const [signUpFailed, setSignUpFailed] = useState(false);
  const [isAlreadyUser, setIsAlreadyUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const login = () => {
    setIsLogin(true);
    clearInputs();
  };

  const handleShowPassword = (type) => {
    switch (type) {
      case "login":
        setShowPassword(!showPassword);
        break;
      case "create":
        setShowCreatePassword(!showCreatePassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        console.log("none");
        break;
    }
  };

  const clearInputs = () => {
    setRegMobileNumber("");
    setCreatePassword("");
    setConfirmPassword("");
  };

  // const handlePasswordError = () => {
  //   if (hasLowerCase && hasUpperCase && hasSpecialChar && hasMinLength) {
  //     setPasswordError(false);
  //   } else if (
  //     !hasLowerCase &&
  //     hasUpperCase &&
  //     hasSpecialChar &&
  //     hasMinLength
  //   ) {
  //     setHasLowerCase(false);
  //   }else if(!hasUpperCase &&)
  // };

  const signupUser = async (e) => {
    e.preventDefault();
    if (
      regMobileNumber &&
      createPassword &&
      confirmPassword &&
      passwordError !== true
    ) {
      if (createPassword !== confirmPassword) {
        setSignUpFailed(true);
      } else {
        setSignUpFailed(false);
        const response = await axios.post(
          "https://polling-server.onrender.com/toDB",
          {
            Mobile: regMobileNumber,
            Password: createPassword,
          }
        );

        if (response.status === 201) {
          setIsAlreadyUser(true);
          setIsLogin(false);
          console.log("user already");
        } else if (response.status === 200) {
          setIsLogin(true);
          setAllInputAlert(false);
          setRegMobileNumber("");
          setCreatePassword("");
          setConfirmPassword("");
          setSignUpFailed(false);
          setIsAlreadyUser(false);
          console.log("signed");
        }
      }

      if (userName === "") {
        setLoggedUser(regMobileNumber);
      } else {
        setLoggedUser(userName);
      }
      // }
    } else {
      setAllInputAlert(true);
    }
  };

  const signUpUserUsingSocket = (e) => {
    e.preventDefault();
    if (regMobileNumber && createPassword && confirmPassword) {
      if (createPassword !== confirmPassword) {
        setSignUpFailed(true);
      } else {
        setSignUpFailed(false);

        socket.emit("signUpUser", {
          Mobile: regMobileNumber,
          Password: createPassword,
        });

        socket.on("userRegisteredAlready", () => {
          setIsAlreadyUser(true);
          setIsLogin(false);
          console.log("user already");
        });

        socket.on("userRegistered", () => {
          setIsLogin(true);
          setAllInputAlert(false);
          setRegMobileNumber("");
          setCreatePassword("");
          setConfirmPassword("");
          setSignUpFailed(false);
          setIsAlreadyUser(false);
          console.log("signed");
        });
      }

      if (userName === "") {
        setLoggedUser(regMobileNumber);
      } else {
        setLoggedUser(userName);
      }
    } else {
      setAllInputAlert(true);
    }
  };

  useEffect(() => {
    setPasswordError(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  return (
    <>
      <>
        <div className="space-y-3 sm:space-y-0 lg:space-y-0 flex flex-col items-center justify-center pt-[2rem] text-gray-600">
          {/* <img
            className="object-cover h-[10vh] w-[20vw]  text-center text-gray-700 items-center font-poppins"
            src={logo}
          ></img> */}
          <img
            className="font-extrabold text-xl sm:text-4xl object-cover h-[8vh] md:h-[10vh] w-[80%] md:w-[65%] lg:w-[25vw] text-center text-gray-700 items-center font-poppins"
            src={logo}
          >
            {/* Easy Transfer */}
          </img>
          <h1 className="text-center m-0 text-[4vw]   sm:text-2xl font-bold font-poppins    cursor-default ">
            User Register
          </h1>
        </div>

        <form className="flex flex-col items-center w-full m-auto    rounded-xl text-gray-800  ">
          <div className="flex flex-col w-[80%] ">
            <label htmlFor="" className="mb-[.2rem] text-[14px]">
              Mobile Number
            </label>
            <input
              className={
                regMobileNumber.length < 10 && regMobileNumber
                  ? "outline-0 h-10 w-full border-2 border-red-500  rounded-lg  p-[1rem] text-[16px]  border-box "
                  : isAlreadyUser || (allInputAlert && !regMobileNumber)
                  ? "outline-0 h-10 w-full border-2 border-red-500  rounded-lg  p-[1rem]  text-[16px] border-box "
                  : "outline-0 h-10 w-full border-2 border-slate-200  rounded-lg  p-[1rem] text-[16px]  border-box "
              }
              type="tel"
              minLength={10}
              maxLength={10}
              value={regMobileNumber}
              onChange={handleRegMobileNumber}
              placeholder="Enter Mobile Number"
              required={true}
            />
            {regMobileNumber.length < 10 && regMobileNumber ? (
              <p className="text-xs w-[80%] mt-[.4rem] text-red-500">
                Mobile number must have 10 digits
              </p>
            ) : null}
            {allInputAlert && !regMobileNumber ? (
              <div className="w-[80%]">
                {" "}
                <p className="text-xs mt-[.2rem] text-red-500">
                  Enter Mobile Number
                </p>
              </div>
            ) : null}
            {isAlreadyUser ? (
              <p className="w-[80%] text-red-500 mt-[.2rem] text-xs">
                Mobile number already registered!
              </p>
            ) : null}
          </div>

          <div className="flex flex-col w-[80%] mt-[.2rem]  ">
            <label
              htmlFor=""
              className="block leading-6 text-left text-[14px] mb-[.2rem]  "
            >
              Create Password
            </label>
            <input
              className={
                passwordError
                  ? "outline-0 h-10 w-full rounded-lg text-[16px] p-[1rem] border-2 border-red-500  border-box "
                  : signUpFailed || (allInputAlert && !createPassword)
                  ? "outline-0 h-10 w-full rounded-lg text-[16px] p-[1rem] border-2 border-red-500  border-box "
                  : "outline-0 h-10 w-full rounded-lg text-[16px] p-[1rem] border-2 border-slate-200  border-box "
              }
              type={showCreatePassword ? "text" : "password"}
              min={6}
              max={10}
              value={createPassword}
              onChange={handleCreatePassword}
              onClick={() => setPasswordError(true)}
              placeholder="Enter Your Password"
              required
            />
            {showCreatePassword ? (
              <FaRegEye
                className="relative ml-[56.5vw] sm:ml-[42vw] md:ml-[35vw] lg:ml-[20vw] xl:ml-[23.8vw] bottom-[1.7rem] text-zinc-400"
                onClick={() => handleShowPassword("create")}
              />
            ) : (
              <FaRegEyeSlash
                className="relative ml-[56.5vw] sm:ml-[42vw] md:ml-[35vw] lg:ml-[20vw] xl:ml-[23.8vw] bottom-[1.7rem] text-zinc-400"
                onClick={() => handleShowPassword("create")}
              />
            )}

            {passwordError ? (
              !/[A-Z]/.test(createPassword) ? (
                <p className="w-full text-red-500 text-xs mt-[-.8rem] mb-[.4rem] ">
                  Password must have 1 upper case
                </p>
              ) : !/[a-z]/.test(createPassword) ? (
                <p className="w-full text-red-500 text-xs mt-[-.8rem] mb-[.4rem]">
                  Password must have 1 lower case
                </p>
              ) : !/[!@#$%^&*()-_+={}[\]:;'"<>,./?0-9]/.test(createPassword) ? (
                <p className="w-full text-red-500 text-xs mt-[-.8rem] mb-[.4rem]">
                  Password must have 1 special character
                </p>
              ) : createPassword.length < 8 ? (
                <p className="w-full text-red-500 text-xs mt-[-.8rem] mb-[.4rem]">
                  Password must have 8 letters
                </p>
              ) : null
            ) : allInputAlert && !createPassword ? (
              <p className="text-xs text-red-500 mt-[-.8rem] mb-[.4rem]">
                Enter Password
              </p>
            ) : null}
          </div>

          <div className="flex flex-col  w-[80%] mt-[-.4rem]">
            <label
              htmlFor=""
              className="block leading-6 text-left text-[14px] mb-[.2rem]  "
            >
              Confirm Password
            </label>
            <input
              className={
                signUpFailed || (allInputAlert && !confirmPassword)
                  ? "outline-0 h-10 w-full rounded-lg  p-[1rem] text-[16px] border-2 border-red-500  border-box "
                  : "outline-0 h-10 w-full rounded-lg  p-[1rem] text-[16px] border-2 border-slate-200  border-box "
              }
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPassword}
              placeholder="Enter Your Password"
              min={6}
              max={10}
              required
            />
            {showConfirmPassword ? (
              <FaRegEye
                className="relative ml-[56.5vw] sm:ml-[42vw] md:ml-[35vw] lg:ml-[20vw] xl:ml-[23.8vw] bottom-[1.8rem] text-zinc-400"
                onClick={() => handleShowPassword("confirm")}
              />
            ) : (
              <FaRegEyeSlash
                className="relative ml-[56.5vw] sm:ml-[42vw] md:ml-[35vw] lg:ml-[20vw] xl:ml-[23.8vw] bottom-[1.8rem] text-zinc-400"
                onClick={() => handleShowPassword("confirm")}
              />
            )}
          </div>

          {signUpFailed ||
          (createPassword !== confirmPassword && confirmPassword) ? (
            <p className="w-[80%] text-xs mt-[-.8rem] text-red-500">
              Password does not match
            </p>
          ) : allInputAlert && !confirmPassword ? (
            <p className="text-xs w-[80%] text-red-500 mt-[-.8rem] mb-[.4rem]">
              Enter Password
            </p>
          ) : null}

          <div className="w-[80%] items-center flex justify-center">
            {" "}
            <button
              className="w-full bg-gray-800 hover:bg-gray-600 border-0  text-white text-center p-[.5rem] font-bold font-sans h-auto  mt-[1rem] rounded-md "
              onClick={
                connectionMode === "socket" ? signUpUserUsingSocket : signupUser
              }
            >
              Sign up
            </button>
          </div>
          <div className="flex flex-col justify-center  items-center">
            <p
              className={
                passwordError
                  ? "font-light text-xs mb-[2rem]  mt-[.4rem]"
                  : "font-light text-xs mb-[2rem]  mt-[3rem]"
              }
            >
              Already have an account?{" "}
              <strong
                className="font-bold text-gray-800 cursor-pointer"
                onClick={login}
              >
                Login
              </strong>
            </p>
          </div>
        </form>
      </>
      {/* </div> */}
    </>
  );
}

export default memo(SignUp);
