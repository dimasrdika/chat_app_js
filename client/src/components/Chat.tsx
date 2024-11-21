import { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { Socket } from "socket.io-client";
import { FaPaperPlane } from "react-icons/fa"; // Paper plane icon for sending messages

interface Message {
  room: string;
  username: string;
  message: string;
  time: string;
}

interface ChatProps {
  socket: Socket;
  username: string;
  room: string;
}

function Chat({ socket, username, room }: ChatProps) {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<Message[]>([]);

  // Function to send a message
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData: Message = {
        room: room,
        username: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData); // Emit the message to the server
      setMessageList((list) => [...list, messageData]); // Add to local message list
      setCurrentMessage(""); // Reset input field
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receive_message", (data: Message) => {
      setMessageList((list) => [...list, data]); // Append new messages to the list
    });

    // Clean up on component unmount
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  return (
    <div className="chat-window w-80 h-[450px] bg-white rounded-xl shadow-lg flex flex-col">
      <div className="chat-header bg-gray-800 text-white p-4 rounded-t-xl">
        <p className="font-semibold text-lg">Live Chat</p>
      </div>

      <div className="chat-body flex-1 overflow-y-auto p-4 space-y-4">
        <ScrollToBottom className="message-container space-y-2">
          {messageList.map((messageContent, index) => (
            <div
              key={index}
              className={`message p-3 mb-4 rounded-lg ${
                username === messageContent.username
                  ? "bg-green-400 ml-auto text-white"
                  : "bg-blue-400 mr-auto text-white"
              }`}
            >
              <div className="message-content break-words">
                <p>{messageContent.message}</p>
              </div>
              <div className="message-meta text-xs flex justify-between text-gray-600">
                <span>{messageContent.time}</span>
                <span>{messageContent.username}</span>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>

      <div className="chat-footer flex items-center p-4 border-t border-gray-300">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              sendMessage();
            }
          }}
          className="w-full bg-transparent focus:outline-none p-2 text-gray-800"
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
        >
          <FaPaperPlane size={20} />
        </button>
      </div>
    </div>
  );
}

export default Chat;
