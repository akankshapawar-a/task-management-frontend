"use client";
import Link from "next/link";
import React, { useState } from "react";
import image from "../../../../public/image.png";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Type {
  type: "signup" | "login";
}
const AuthForm = ({ type }: Type) => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e:any) => {
     e.preventDefault();
    const payload = {
      ...(type === "signup" && { username: input.username }),
      email: input.email,
      password: input.password,
    };
    try {
      const authapi = type === "login" ? "login" : "signup";
      const response = await axios.post(
        `http://127.0.0.1:5000/api/${authapi}`,
        payload
      );
        // console.log('res',response.data.user.username);
       const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('username', response.data.user.username);
      }
      if (response.data.status === "SUCCESS") {
      
        const message =
          type === "login" ? "Login Successful!" : "Signup Successful!";
        toast.success(message);
       
       
      }
        router.push("/myboard");
    } catch (error) {
      const errorMessage = type === "login" ? "Login Falied" : "Signup Failed";
      toast.error(`${errorMessage} ${error}`);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className="mt-2 flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold">
                {type === "login" ? "Login" : "Signup"}
              </h1>
              <div className="w-full flex-1 mt-1">
                <div className="flex flex-col items-center"></div>
                <div className="my-3 border-b text-center"></div>
                <form onSubmit={handleSubmit}>
                  <div className="mx-auto max-w-xs">
                    {type === "signup" && (
                      <input
                        name="username"
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type="text"
                        placeholder="Username"
                        value={input.username}
                        onChange={handleChange}
                      />
                    )}
                    <input
                      name="email"
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white  mt-5"
                      type="email"
                      placeholder="Email"
                      value={input.email}
                      onChange={handleChange}
                    />
                    <input
                      name="password"
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password"
                      placeholder="Password"
                      value={input.password}
                      onChange={handleChange}
                    />
                    <button
                      type="submit"
                      className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      <svg
                        className="w-6 h-6 -ml-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                 strokeLinecap="round"
strokeLinejoin="round"

                      >
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <path d="M20 8v6M23 11h-6" />
                      </svg>
                      <span className="ml-3">
                        {type === "login" ? "Login" : "Signup"}
                      </span>
                    </button>
                    <p className="mt-6 text-xs text-gray-600 text-center">
                      I agree the
                      <a
                        href="#"
                        className="border-b border-gray-500 border-dotted"
                      >
                        Terms of Service
                      </a>
                      and its
                      <a
                        href="#"
                        className="border-b border-gray-500 border-dotted"
                      >
                        Privacy Policy
                      </a>
                    </p>
                    {type === "signup" ? (
                      <p className=" text-sm text-center mt-2">
                        Already have an account?{" "}
                        <Link
                          href="/login"
                          className=" text-blue-600 underline"
                        >
                          SignIn Here
                        </Link>{" "}
                      </p>
                    ) : (
                      <p className=" text-sm text-center mt-2">
                        Dont have an account?{" "}
                        <Link
                          href="/signup"
                          className=" text-blue-600 underline"
                        >
                          Create Here
                        </Link>{" "}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div className="m-8 xl:m-12 w-full h-full bg-contain bg-center bg-no-repeat">
              <Image src={image} alt="login" className=" w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
