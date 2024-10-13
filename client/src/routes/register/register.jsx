import { useState } from "react";
import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error,setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()



  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    setError("")
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try{

      const res = await apiRequest.post("/auth/register", {username: username, email: email, password: password})
     navigate("/login")
    }catch(err){
      console.error(err);
      setError(err.response.data.message)
    }finally{
      setLoading(false)
      
    }


  }

  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" required minLength={3} maxLength={20}/>
          <input name="email" type="text" placeholder="Email" required/>
          <input name="password" type="password" placeholder="Password" required minLength={3} maxLength={20}/>
          <button disabled={loading}>Register</button>
          {error && <p>{error}</p>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
