import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import SocketContext from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import PropTypes from "prop-types";
import { fetchData } from "../../lib/utils";
import { getCurrentUser, getToken } from "../../redux/user/useSelectors";
import { FaPaperPlane } from "react-icons/fa"; // Importing the send icon
import "./chat.scss";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const currentUser = useSelector(getCurrentUser);
  const token = useSelector(getToken);

  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await fetchData(`/api/chats/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res && res.id) {
        if (!res.seenBy.includes(currentUser.id)) {
          decrease();
        }
        setChat({ ...res, receiver });
      } else {
        console.error("Unexpected API response structure:", res);
      }
    } catch (err) {
      console.error("Failed to open chat:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");
    if (!text) return;

    try {
      const res = await fetchData(`/api/messages/${chat.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!res || !res.id) {
        throw new Error("Invalid API response");
      }

      const newMessage = res;
      setChat((prev) => ({ ...prev, messages: [...prev.messages, newMessage] }));
      e.target.reset();

      if (socket) {
        socket.emit("sendMessage", {
          receiverId: chat.receiver.id,
          chatId: chat.id,
          text: newMessage.text,
          userId: newMessage.userRef,
          createdAt: newMessage.createdAt,
        });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await fetchData(`/api/chats/read/${chat.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ seen: true }),
        });
      } catch (err) {
        console.error("Failed to mark chat as read:", err);
      }
    };

    if (chat && socket) {
      const handleMessage = (data) => {
        if (data && chat.id === data.chatId) {
          setChat((prev) => ({
            ...prev,
            messages: [
              ...prev.messages,
              { chatId: data.chatId, text: data.text, userId: data.userId, createdAt: data.createdAt },
            ],
          }));
          read();
        }
      };

      socket.on("getMessage", handleMessage);

      return () => {
        socket.off("getMessage", handleMessage);
      };
    }
  }, [socket, chat, token]);

  return (
    <div className="chatContainer">
      <div className="messages">
        <h1>Messages</h1>

        {chats?.map((c) => (
          <div
            className="message"
            key={c.id}
            style={{
              backgroundColor: c.seenBy.includes(currentUser.id) || chat?.id === c.id ? "white" : "#fecd514e",
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
            <div className="messageInfo">
              <span>{c.receiver.username}</span>
              <p>{c.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>

      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "/noavatar.jpg"} alt="" />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {chat.messages?.length > 0 ? (
              chat.messages.map((message) =>
                message ? (
                  <div
                    className={`chatMessage ${message.userId === currentUser.id ? "own" : ""}`}
                    key={message.id}
                  >
                    <p>{message.text}</p>
                    <span>{format(message.createdAt)}</span>
                  </div>
                ) : null
              )
            ) : (
              <p>No messages yet</p>
            )}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text" />
            <button type="submit">
              <FaPaperPlane /> Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

Chat.propTypes = {
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      seenBy: PropTypes.arrayOf(PropTypes.string).isRequired,
      receiver: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        avatar: PropTypes.string,
        username: PropTypes.string.isRequired,
      }).isRequired,
      lastMessage: PropTypes.string.isRequired,
    })
  ),
};

export default Chat;
