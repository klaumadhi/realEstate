import { createContext, useContext, useEffect, useState } from "react";
import {io} from "socket.io-client"
import { AuthContext } from "./AuthContext";
export const SocketContext = createContext()
export const SocketContextProvider = ({children})=>{
    const {currentUser} = useContext(AuthContext)
    const [socket, setSocket] =useState(null)
 
    useEffect(()=>{
       setSocket(io("https://realestate-bx27.onrender.com"), {
        reconnection: true, // Allow reconnection
        reconnectionAttempts: Infinity, // Retry reconnection indefinitely
        reconnectionDelay: 500, // Start retrying after 1 second
        reconnectionDelayMax: 1000, // Maximum delay between reconnections
        transports: ["websocket"], // Use WebSocket and disable long polling
        withCredentials: true, // Send cookies with requests if necessary
      })
    },[])
    useEffect(()=>{
        currentUser && socket?.emit("newUser", currentUser.id)
    },[currentUser,socket])
    return(
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}