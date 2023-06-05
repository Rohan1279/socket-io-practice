import { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");
function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  console.log(socket?.connected);
  const joinRoom = () => {
    if (userName && room) {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };
  return (
    <>
      <div>
        {!showChat ? (
          <div className="h-screen grid justify-center items-center">
            <h3 className="text-center">Join A Chat</h3>
            <div className="flex justify-center items-center gap-x-10">
              <input
                className="border border-black  pl-2"
                type="text"
                placeholder="Name"
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                className="border border-black pl-2"
                type="text"
                placeholder="Room ID"
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>
            <button
              className="block mx-auto bg-blue-300 rounded-md p-3 active:bg-violet-400"
              onClick={joinRoom}
            >
              Join Room
            </button>
          </div>
        ) : (
          <Chat socket={socket} userName={userName} room={room}></Chat>
        )}
      </div>
    </>
  );
}

export default App;
