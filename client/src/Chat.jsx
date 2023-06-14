/* eslint-disable*/

import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
export default function Chats({ socket, userName, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  console.log(messageList);
  // console.log(userName);
  const sendMessage = async () => {
    function formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    }
    if (currentMessage) {
      const messageData = {
        room: room,
        author: userName,
        message: currentMessage,
        time: formatAMPM(new Date()),
      };
      await socket.emit("send_message", [...messageList, messageData]);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("")
    }
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessageList((list) => [...list, data]);
    });
    return () => socket.removeListener("receive_message");
  }, [socket]);

  return (
    <div className="">
      <div className="">
        <p className="text-center">Live Chat</p>
      </div>
      {/* <div className=" "> */}
        <ScrollToBottom className="h-[32rem] bg-blue-100/50 max-w-xl mx-auto">
          {messageList?.map((messageContent, idx) => {
            return (
              <div className=" ">
                <div className={` px-5`}>
                  <div
                    className={`w-fit ${
                      userName === messageContent?.author ? "ml-auto" : "  "
                    }`}
                  >
                    <p
                      className={`rounded-t-2xl  max-w-xs w-fit break-all px-3 py-1  text-sm font-medium tracking-wider text-gray-500 ${
                        userName === messageContent?.author
                          ? "bg-violet-200 ml-auto rounded-bl-2xl"
                          : "bg-blue-200 rounded-br-2xl"
                      }`}
                    >
                      {/* <span className="flex justify-center items-center bg-red-600 text-">
                    {messageContent?.message}

                    </span> */}
                      {messageContent?.message}
                    </p>
                    <div className=" text-xs  text-gray-400">
                      <p className={``}>{messageContent?.time}</p>
                      {/* <p>{messageContent?.author}</p> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      {/* </div> */}
      <div className="flex justify-center">
        <input
          className=""
          value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          type="text"
          placeholder="Hey..."
          onKeyDown={(e) => {
            e.key === "Enter" && sendMessage();
            // e.target.reset();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}
