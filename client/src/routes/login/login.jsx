import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest.js";
import { AuthContext } from "../../context/AuthContext.jsx";


function Login() {
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(false)

  const {updateUser} = useContext(AuthContext)

  const navigate = useNavigate()


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    setError("")

    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try{

      const res = await apiRequest.post("/auth/login", {username: username, password: password})
     
      
      updateUser(res.data)
      navigate("/")

    }catch(err){
      console.error(err);
      setError(err.response.data.message)
    }finally{
      setLoading(false)
      
    }
  }
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" type="text" placeholder="Username" required/>
          <input name="password" type="password" placeholder="Password" required/>
          <button disabled={loading}>Login</button>
          {error && <span >{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
