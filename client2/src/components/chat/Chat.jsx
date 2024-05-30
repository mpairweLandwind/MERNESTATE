import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { useSelector, useDispatch } from 'react-redux';
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import SocketContext from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import PropTypes from "prop-types";
import { clearCurrentUser } from "../../redux/user/userSlice";
// eslint-disable-next-line no-unused-vars
import React from "react";


function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");
    if (!text) return;
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat(prev => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      if (socket) {
        socket.emit("sendMessage", {
          receiverId: chat.receiver.id,
          data: res.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    dispatch(clearCurrentUser());
  };

  return (
    <div className="chat">
      <div className="header">
        <h1>Messages</h1>
        <button onClick={handleLogout} className="logoutButton">Logout</button>
      </div>
      <div className="messages">
        {chats?.map(c => (
          <div
            className="message"
            key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#fecd514e",
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
            <span>{c.receiver.username}</span>
            <p>{c.lastMessage}</p>
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "noavatar.jpg"} alt="" />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {chat.messages.map(message => (
              <div
                className="chatMessage"
                key={message.id}
                style={{
                  alignSelf: message.userId === currentUser.id ? "flex-end" : "flex-start",
                  textAlign: message.userId === currentUser.id ? "right" : "left",
                }}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
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

Chat.propTypes = {
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      seenBy: PropTypes.arrayOf(PropTypes.number).isRequired,
      receiver: PropTypes.shape({
        id: PropTypes.number.isRequired,
        avatar: PropTypes.string,
        username: PropTypes.string.isRequired,
      }).isRequired,
      lastMessage: PropTypes.string.isRequired,
    })
  ),
};

export default Chat;