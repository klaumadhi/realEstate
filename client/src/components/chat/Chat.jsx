import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Chat({ chats: initialChats }) {
  const [chats, setChats] = useState(initialChats); // Track the chats locally
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);
  const increase = useNotificationStore((state) => state.increase);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest(`/chats/${id}`);
      
      // Check if the current user has already seen the message
      if (!res?.data.seenBy.includes(currentUser.id)) {
        // Mark as read by adding the current user's ID to the seenBy array
        res.data.seenBy.push(currentUser.id);
        
        
        decrease(); // Decrease notification count
      }
      
      // Set the active chat
      setChat({ ...res.data, receiver });
      
      // Update the chats in state with the updated seenBy information
      setChats((prevChats) =>
        prevChats.map((c) =>
          c.id === id ? { ...c, seenBy: [...c.seenBy, currentUser.id] } : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;

    try {
      const res = await apiRequest.post(`/messages/${chat.id}`, { text });

      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, res.data],
      }));

      setChats((prevChats) =>
        prevChats.map((c) =>
          c.id === chat.id ? { ...c, lastMessage: res.data.text } : c
        )
      );

      e.target.reset();

      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Listen for incoming messages and handle notifications
  // Listen for incoming messages and handle notifications
  useEffect(() => {
    if (socket) {
      socket.on("getMessage", (data) => {
        // Update the lastMessage for the correct chat
        setChats((prevChats) =>
          prevChats.map((c) =>
            c.id === data.chatId ? { ...c, lastMessage: data.text, seenBy: [] } : c
          )
        );
  
        // If the active chat is not open, increase notifications
        if (chat?.id !== data.chatId) {
          increase(); // Increase notification count
        } else {
          // If the active chat is open, update messages
          setChat((prev) => ({
            ...prev,
            messages: [...prev.messages, data],
          }));
        }
      });
    }
  
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);
  

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((c) => {
  const isUnread = !c.seenBy.includes(currentUser.id) && c.id !== chat?.id;

  return (
    <div
      className="message"
      key={c.id}
      style={{
        backgroundColor: isUnread ? "#fecd514e" : "white", // Change color if it's unread
      }}
      onClick={() => handleOpenChat(c.id, c.receiver)}
    >
      <img src={c?.receiver?.avatar || "/noavatar.jpg"} alt="" />
      <span>{c?.receiver?.username}</span>
      <p>{c?.lastMessage || "No messages yet"}</p>
    </div>
  );
})}

      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver?.avatar || "/noavatar.jpg"} alt="" />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>X</span>
          </div>
          <div className="center">
            {chat?.messages.map((msg) => (
              <div
                className="chatMessage"
                style={{
                  alignSelf:
                    msg.userId === currentUser.id ? "flex-end" : "flex-start",
                  textAlign: msg.userId === currentUser.id ? "right" : "left",
                }}
                key={msg.id}
              >
                <p>{msg.text}</p>
                <span>{format(msg.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>

          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
