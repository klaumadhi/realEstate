import { createContext, useContext, useEffect, useState } from "react";
import {io} from "socket.io-client"
import { AuthContext } from "./AuthContext";
export const SocketContext = createContext()
export const SocketContextProvider = ({children})=>{
    const {currentUser} = useContext(AuthContext)
    const [socket, setSocket] =useState(null)
 
    useEffect(() => {
        if (currentUser) {
          const newSocket = io("https://realestate-bx27.onrender.com", {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 500,
            reconnectionDelayMax: 1000,
            transports: ["websocket"],
            withCredentials: true,
          });
          setSocket(newSocket);
      
          // Clean up the socket when the component unmounts
          return () => newSocket.close();
        }
      }, [currentUser]);
    useEffect(()=>{
        currentUser && socket?.emit("newUser", currentUser.id)
    },[currentUser,socket])
    return(
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}