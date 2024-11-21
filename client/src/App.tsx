import { useState } from "react";
import io, { Socket } from "socket.io-client";
import { FaUser, FaKey } from "react-icons/fa"; // Importing some icons
import Chat from "./components/Chat";

const socket: Socket = io("http://localhost:3001");

function App() {
  const [username, setUsername] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App min-h-screen bg-gray-100 flex justify-center items-center">
      {!showChat ? (
        <div className="joinChatContainer flex flex-col items-center bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-medium text-gray-800 mb-4">
            Join A Chat
          </h3>

          <div className="w-64 mb-4 flex items-center border-b border-gray-300 py-2">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>

          <div className="w-64 mb-6 flex items-center border-b border-gray-300 py-2">
            <FaKey className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Room ID"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>

          <button
            onClick={joinRoom}
            className="w-64 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
          >
            Join Room
          </button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
