import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux';
import { format } from "timeago.js";
import SocketContext from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import PropTypes from "prop-types";
import { fetchData } from "../../lib/utils";
import "./chat.scss";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const { currentUser, token } = useSelector(state => state.user);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const decreaseNotificationCount = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (chatId, receiver) => {
    try {
      const res = await fetchData(`/api/chats/${chatId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.data.seenBy.includes(currentUser.id)) {
        decreaseNotificationCount();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.error("Failed to open chat:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = new FormData(e.target).get("text").trim();
    if (!text) return;

    try {
      const res = await fetchData(`/api/messages/${chat.id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
      setChat(prev => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    const handleMessageReceive = (data) => {
      if (chat?.id === data.chatId) {
        setChat(prev => ({ ...prev, messages: [...prev.messages, data] }));
      }
    };

    socket.on("getMessage", handleMessageReceive);
    return () => socket.off("getMessage", handleMessageReceive);
  }, [socket, chat]);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {Array.isArray(chats) && chats.length > 0 ? (
          chats.map((c) => (
            <div
              className="message"
              key={c.id}
              style={{ backgroundColor: c.seenBy.includes(currentUser.id) || chat?.id === c.id ? "white" : "#fecd514e" }}
              onClick={() => handleOpenChat(c.id, c.receiver)}
            >
              <img src={c.receiver.avatar || "/noavatar.jpg"} alt={c.receiver.username} />
              <span>{c.receiver.username}</span>
              <p>{c.lastMessage}</p>
            </div>
          ))
        ) : (
          <p>No chats available</p>
        )}
      </div>
      {chat && (
        <div className="chatBox">
          <ChatBox chat={chat} currentUser={currentUser} setChat={setChat} handleSubmit={handleSubmit} messageEndRef={messageEndRef} />
        </div>
      )}
    </div>
  );
  
}

function ChatBox({ chat, currentUser, setChat, handleSubmit, messageEndRef }) {
  return (
    <>
      <div className="top">
        <img src={chat.receiver.avatar || "noavatar.jpg"} alt={chat.receiver.username} />
        <span>{chat.receiver.username}</span>
        <span className="close" onClick={() => setChat(null)}>X</span>
      </div>
      <div className="center">
        {chat.messages.map(message => (
          <div key={message.id} className="chatMessage" style={{
            alignSelf: message.userId === currentUser.id ? "flex-end" : "flex-start",
            textAlign: message.userId === currentUser.id ? "right" : "left"
          }}>
            <p>{message.text}</p>
            <span>{format(message.createdAt)}</span>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
      <form onSubmit={handleSubmit} className="bottom">
        <textarea name="text"></textarea>
        <button type="submit">Send</button>
      </form>
    </>
  );
}

Chat.propTypes = {
  chats: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    seenBy: PropTypes.arrayOf(PropTypes.number).isRequired,
    receiver: PropTypes.shape({
      id: PropTypes.number.isRequired,
      avatar: PropTypes.string,
      username: PropTypes.string.isRequired,
    }).isRequired,
    lastMessage: PropTypes.string.isRequired,
  })).isRequired,
};
Chat.propTypes = {
  chats: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    seenBy: PropTypes.arrayOf(PropTypes.number).isRequired,
    receiver: PropTypes.shape({
      id: PropTypes.number.isRequired,
      avatar: PropTypes.string,
      username: PropTypes.string.isRequired,
    }).isRequired,
    lastMessage: PropTypes.string.isRequired,
  })).isRequired,
};

ChatBox.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.number.isRequired,
    receiver: PropTypes.shape({
      id: PropTypes.number.isRequired,
      avatar: PropTypes.string,
      username: PropTypes.string.isRequired,
    }).isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  setChat: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  messageEndRef: PropTypes.object.isRequired,
};

export default Chat;
