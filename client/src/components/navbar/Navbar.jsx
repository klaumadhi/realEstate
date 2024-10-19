import { useContext, useState } from "react";
import "./navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import apiRequest from "../../lib/apiRequest";

function Navbar() {
  const [open, setOpen] = useState(false);
  const {currentUser, updateUser} = useContext(AuthContext)
  const navigate = useNavigate()
  const fetch = useNotificationStore(state=> state.fetch)
  const number = useNotificationStore(state=> state.number)

  if(currentUser) fetch()

    const handleLogout = async () => {

      try{
        await apiRequest.post('/auth/logout')
        updateUser(null)
        navigate('/')
  
      }catch(e){
        console.log(e)
      }}

  return (
    <nav>
      <div className="left">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>KlauEstate</span>
        </Link>
        <Link to="/">Home</Link>
        <Link to="/list">Properties</Link>
        <Link to="/">Contact</Link>
        <Link to="/">Agents</Link>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <Link to="/profile">
            {number > 0 && <div>{number}</div>}
            <img
              src={currentUser.avatar || "/noavatar.jpg"}
              alt=""
              />
              </Link>
            <span>{currentUser.username}</span>
            <Link to="/profile" className="profile">
             {number > 0 && <div className="notification">{number}</div>}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/register" className="register">
              Sign up
            </Link>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <Link to="/">Home</Link>
          {currentUser && <Link to="/profile">Profile</Link>}
          <Link to="/list">Properties</Link>
          <Link to="/">Contact</Link>
          <Link to="/">Agents</Link>
          {!currentUser && (<>
            <Link to="/login">Sign in</Link>
          <Link to="/register">Sign up</Link>
          </>
          
          )}
          {currentUser && <Link onClick={handleLogout}>Logout</Link>}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
