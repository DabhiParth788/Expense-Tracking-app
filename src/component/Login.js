import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const host = "http://127.0.0.1:5500/";
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });

  let navigate = useNavigate();

  const handleChange = (e) => {
    setCredential({ ...credential, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${host}api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credential.email,
        password: credential.password,
      }),
    });

    const json = await response.json();
    console.log(json);

    if (json.success) {
      localStorage.setItem("token", json.authToken);
      navigate("/");
      console.log("You have been successfully login.");
      setCredential({
        email: "",
      });
    } else {
      console.log("Invalid Credential.");
    }

    setCredential({
      password: "",
    });
  };

  return (
    <>
      {/* <div className="w-full grid grid-cols-2 h-full">
        <div id="singUp-img" className="flex justify-center items-center">
          <img
            src="https://images.unsplash.com/photo-1545941962-1b6654eb8072?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="trash paper"
            className="w-3/4 pt-3 h-[95%]"
          />
        </div>
        <div id="login-form" className="mt-10">
          <h1 className="font-bold text-2xl flex justify-center">Login.</h1>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credential.email}
                required
                onChange={handleChange}
                className="border-2"
              />
            </div>
            <div className="flex gap-2">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credential.password}
                required
                onChange={handleChange}
                className="border-2"
              />
            </div>
            <button type="submit" className="bg-gray-300 px-3 py-2">
              Login
            </button>
          </form>
        </div>
      </div> */}

      {/* new login */}
      <div class="lg:flex ">
        <div class="hidden lg:flex items-center justify-center w-1/2">
          <div id="singUp-img" className="flex justify-center items-center ">
            <img
              src="https://images.unsplash.com/photo-1545941962-1b6654eb8072?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="trash paper"
              className="w-3/4 pt-3 h-[95%]"
            />
          </div>
        </div>

        <div class="lg:w-1/2 xl:max-w-screen-sm">
          <div class="mt-10 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-16 xl:px-24 xl:max-w-2xl">
            <h2 class="text-center text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">
              Log in
            </h2>
            <div class="mt-12">
              <form onSubmit={handleSubmit}>
                <div>
                  <div class="text-sm font-bold text-gray-700 tracking-wide">
                  <label htmlFor="email">Email Address</label>
                  </div>
                  <input
                    class="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    type="email"
                    id="email"
                    name="email"
                    value={credential.email}
                    required
                    onChange={handleChange}
                    placeholder="krish@gmail.com"
                  />
                </div>
                <div class="mt-8">
                  <div class="flex justify-between items-center">
                    <div class="text-sm font-bold text-gray-700 tracking-wide">
                    <label htmlFor="password">Password</label>
                    </div>
                    <div>
                      <a class="text-xs font-display font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                        Forgot Password?
                      </a>
                    </div>
                  </div>
                  <input
                    class="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    type="password"
                    id="password"
                    name="password"
                    value={credential.password}
                    required
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                </div>
                <div class="mt-10">
                  <button class="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg">
                    Log In
                  </button>
                </div>
              </form>
              <div class="mt-12 text-sm font-display font-semibold text-gray-700 text-center">
                Don't have an account ?
                <a class="cursor-pointer text-indigo-600 hover:text-indigo-800">
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
