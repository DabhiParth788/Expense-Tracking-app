import { paste } from '@testing-library/user-event/dist/paste';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const host = "http://127.0.0.1:5500/";
  const [credential, setCredential] = useState({
    name: "",
    email: "",
    city: "",
    password: "",
    cPassword: ""
  });

  let navigate = useNavigate();

  const handleChange = (e) => {
    setCredential({...credential, [e.target.name]: e.target.value });
  };

  // #TODO handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(credential.password !== credential.cPassword){
      setCredential({ password: "", cPassword: "" });
      console.log("Password doesn't match!");
      return;
    }
    const response = await fetch(`${host}api/auth/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: credential.name,
        email: credential.email,
        city: credential.city,
        password: credential.password
      })
    });

    const json = await response.json();
    console.log(json);
    if (json.success){
      localStorage.setItem("token", json.authToken);
      navigate("/");
      console.log("Your account has been successfully created");
    }
    else{
      console.log("Already account exist");
    }
    setCredential({ name: "", email: "", city: "", password: "", cPassword: "" });
  };

  return (
    <>
      <div className='w-full grid grid-cols-2 h-full'>
        <div id='signUp-form' className='mt-10'>
          <h1 className='font-bold text-2xl flex justify-center'>Sign Up.</h1>
          <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='flex gap-2'>
              <label htmlFor='name'>
                Name
              </label>
              <input type='text' id='name' name="name" value={credential.name} minLength={3} required onChange={handleChange} className='border-2' />
            </div>
            <div className='flex gap-2'>
              <label htmlFor='email'>
                Email
              </label>
              <input type='email' id='email' name="email" value={credential.email} required onChange={handleChange} className='border-2' />
            </div>
            <div className='flex gap-2'>
              <label htmlFor='city'>
                City
              </label>
              <input type='text' id='city' name="city" value={credential.city} required onChange={handleChange} className='border-2' />
            </div>
            <div className='flex gap-2'>
              <label htmlFor='password'>
                Password
              </label>
              <input type='password' id='password' name="password" value={credential.password} required onChange={handleChange} className='border-2' />
            </div>
            <div className='flex gap-2'>
              <label htmlFor='rePassword'>
                re-Password
              </label>
              <input type='password' id='rePassword' name="cPassword" value={credential.cPassword} required onChange={handleChange} className='border-2' />
            </div>
            <button type='submit' className='bg-gray-300 px-3 py-2' >
              SignUp
            </button>
          </form>
        </div>
        <div id='singUp-img' className='flex justify-center items-center'>
          <img src='https://images.unsplash.com/photo-1545941962-1b6654eb8072?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='trash paper' className='w-3/4 pt-3 h-[95%]' />
        </div>
      </div>
    </>
  )
}

export default SignUp
