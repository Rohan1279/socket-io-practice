/* eslint-disable*/

import { useEffect, useState } from "react";
export default function Chats({ socket, userName, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [reciever, setReciever] = useState("");
  const [messageList, setMessageList] = useState([]);
  console.log(socket?.connected);
  // console.log(userName);
  const sendMessage = async () => {
    if (currentMessage) {
      const messageData = {
        room: room,
        author: userName,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
    }
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setReciever(data?.author);
      setMessageList((list) => [...list, data]);
    });
    return () => socket.removeListener("receive_message");
  }, [socket]);

  return (
    <div className="">
      <div className="">
        <p className="text-center">Live Chat</p>
      </div>
      <div className="mt-20">
        {messageList?.map((messageContent, idx) => {
          return (
            <div className="">
              <div className={``}>
                <div className="bg-red-200 ">
                  <p className={` px-6 rounded-md  ${userName === messageContent?.author ? "bg-violet-300 text-left":  "bg-blue-200 text-right"}`}>
                    {messageContent?.message}
                  </p>
                </div>
                <div className="flex text-xs  text-gray-400">
                  <p>{messageContent?.time}</p>
                  <p>{messageContent?.author}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="chat-footer">
        <input
          onChange={(e) => setCurrentMessage(e.target.value)}
          type="text"
          placeholder="Hey..."
          onKeyDown={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}
