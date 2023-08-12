import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";


const Signup = (props) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    if (credentials.password !== credentials.cpassword) {
      props.showAlert("Password not Match", "danger")
    }
    else {


      e.preventDefault();
      const { name, email, password } = credentials
      const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });
      const json = await response.json();
      console.log(json);
      if (json.success) {
        // Save the auth token and redirect
        localStorage.setItem('token', json.authtoken);
        navigate("/")
        props.showAlert("Account Created Successfully", "success")
      }
      else {
        props.showAlert("Invalid Credentials", "danger")
      }
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  return (
    <div className='container mt-2'>
      <h2>Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className='form-label'>Name</label>
          <input type="name" className="form-control" id="name" name='name' value={credentials.name} aria-describedby="emailHelp" placeholder="Enter name" onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className='form-label'>Email address</label>
          <input type="email" className="form-control" id="email" name='email' value={credentials.email} aria-describedby="emailHelp" placeholder="Enter email" onChange={onChange} />
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className='form-label'>Password</label>
          <input type="password" className="form-control" id="password" name='password' value={credentials.password} placeholder="Password" onChange={onChange} minLength={5} required />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className='form-label'>Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name='cpassword' value={credentials.cpassword} placeholder="Confirm Password" onChange={onChange} minLength={5} required />
        </div>
        <button type="submit" className="btn btn-primary" >Submit</button>
      </form>
    </div>
  )
}

export default Signup
