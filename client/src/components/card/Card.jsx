import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./card.scss";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Card({ item }) {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [saved, setSaved] = useState(item.isSaved || false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      const res = await apiRequest.post("/users/save", { postId: item.id });
      setSaved(res.data.isSaved);
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  const handleMessage = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      const chatsRes = await apiRequest.get("/chats");
      const existing = chatsRes.data.find((c) =>
        c.userIDs?.includes(item.userId)
      );
      const chatId = existing
        ? existing.id
        : (await apiRequest.post("/chats", { receiverId: item.userId })).data
            .id;
      navigate("/profile", { state: { openChatId: chatId } });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <Link to={`/${item.id}`} className="mainInfo">
          <h2 className="title">{item.title}</h2>
          <div className="middlePart">
            <p className="address">
              <img src="/pin.png" alt="" />
              <span>{item.address}</span>
            </p>
            <p className="price">€ {item.price}</p>
          </div>
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
        </Link>
        <div className="icons">
          <button
            type="button"
            className={saved ? "icon active" : "icon"}
            onClick={handleSave}
            title={saved ? "Remove from saved" : "Save this place"}
          >
            <img src="/save.png" alt="" />
          </button>
          <button
            type="button"
            className="icon"
            onClick={handleMessage}
            title="Message the owner"
          >
            <img src="/chat.png" alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
