import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetUser, setUser } from "../redux/userSlice/userSlice";
import "./Dashboard.scss";
import Logo from "./Utils/Logo";
import Avatar from "./Utils/Avatar";
import Friends from "./SubSections/FriendsSection.jsx";
import AllUsers from "./SubSections/AllUsers.jsx";
import { io } from "socket.io-client";
import OnlineFriends from "./SubSections/OnlineFriends.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const { username, userId } = useSelector((state) => state.user);
  const [allUsers, setAllUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const messageRef = useRef(null);
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(null);

  useEffect(() => {
    setSocket(io(`http://localhost:8000/`));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", { userId, username });
    socket?.on("setActiveUsers", (data) => {
      setActiveUsers(data);
    });

    socket?.on("getMessage", (newMessage) => {
      console.log("New message from ", newMessage.senderId, " -> ", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    });

    socket?.on("isTyping", (data) => {
      setIsTyping(data);
      setTimeout(() => {
        setIsTyping(null);
      }, 5000);
    });
  }, [socket, userId]);

  useEffect(() => {
    // Scroll to the bottom when the component mounts or when the content changes
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Use Effect when USERID is retrieved from the Redux
    const getFriends = async () => {
      const res1 = await axios.get(`api/conversation/${userId}`);
      socket.emit("getUsers", res1.data.findUsers);
      setFriends(res1.data.findUsers);
    };
    if (userId) {
      getFriends();
    }
  }, [userId]);

  useEffect(() => {
    const checkUser = async () => {
      const res = await axios.get("api/user/profile");
      if (!res.data.error) {
        dispatch(setUser({ username: res.data.username, userId: res.data.id }));
      } else {
        navigate("/");
      }
    };
    checkUser();

    const getAllUsers = async () => {
      const res2 = await axios.get(`api/user/getUsers`);
      // console.log("Gettings Users");

      const AllUsers = res2.data.data;

      const conversationUserIds = friends.flatMap((conversation) => {
        return conversation.members.map((member) => member._id);
      });

      const nonConversationUsers = AllUsers.filter(
        (user) => !conversationUserIds.includes(user._id)
      );

      setAllUsers(nonConversationUsers);
    };
    getAllUsers();

    if (selectedUser) {
      const getMessages = async () => {
        const gettingMessages = await axios.get(
          `/api/conversation/message/${selectedUser._id}`
        );
        setMessages(gettingMessages.data.messages);
      };
      getMessages();
    }
  }, [friends[0], selectedUser]);

  const handleSignout = async () => {
    const res = await axios.get(`api/user/signout`);
    console.log(res.data.message);
    console.log("Signout Success");
    navigate("/");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (message === "") {
      return;
    }
    socket.emit("sendMessage", {
      conversationId: selectedUser?._id,
      senderId: userId,
      message,
      receiverId: selectedUser.members[0]._id,
    });

    const res = await axios.post(`api/conversation/message`, {
      conversationId: selectedUser?._id,
      senderId: userId,
      message,
      receiverId: selectedUser?.members[0]._id,
    });
    setMessages((prev) => [...prev, res.data.newMessage]);
    setMessage("");
  };

  const typing = () => {
    socket.emit("typing", {
      sender: userId,
      receiver: selectedUser?.members[0]?._id,
    });
  };

  return (
    <div className="w-screen h-screen bg-blue-300 flex">
      <div className="w-1/5 bg-[#222831] h-screen">
        <Logo />
        <Avatar username={username} userId={userId} />
        {/* <hr />
        <OnlineFriends userId={userId} activeUsers={activeUsers} /> */}
        <Friends
          activeUsers={activeUsers}
          userId={userId}
          friends={friends}
          setFriends={setFriends}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setAllUsers={setAllUsers}
        />
      </div>

      <div className="w-4/5 md:w-3/5 bg-gray-500 h-screen flex flex-col">
        <div className="flex justify-between items-center p-2">
          <p className="text-3xl p-3 select-none font-bold">
            Welcome <span className="text-white">{username}</span>
          </p>
          <button
            onClick={() => {
              dispatch(resetUser());
              handleSignout();
            }}
            className="bg-blue-500 w-fit h-fit rounded-lg select-none p-3 hover:bg-blue-400 hover:text-white"
          >
            Signout
          </button>
        </div>

        <div className="w-full flex-grow flex flex-col justify-start items-center overflow-y-auto rounded-lg">
          <div className="h-[100000px] w-full bg-green-50 p-3">
            {selectedUser ? (
              messages.length > 0 ? (
                messages.map((m, index) => {
                  if (m.createdAt) {
                    var time, hour, minute, ampm, formattedHours;
                    time = new Date(m.createdAt);
                  } else {
                    time = new Date();
                  }
                  hour = time.getHours();
                  minute =
                    time.getMinutes() < 10
                      ? `0${time.getMinutes()}`
                      : time.getMinutes();
                  ampm = hour >= 12 ? "PM" : "AM";
                  formattedHours = hour % 12 || 12;
                  console.log();
                  return (
                    <React.Fragment key={index}>
                      <div
                        className={`${
                          m.senderId !== userId
                            ? "bg-[#512da8] rounded-r-xl mr-auto "
                            : "bg-gray-300 rounded-l-xl ml-auto"
                        } w-fit pt-2 px-2 flex-col flex justify-center items-center rounded-b-xl mb-1 max-w-[60%] min-w-[5%]`}
                      >
                        <p
                          className={`flex justify-center items-center px-3 py-2 text-start font-semibold text-md rounded-b-xl ${
                            m.senderId !== userId
                              ? "bg-[#5c6bc0] rounded-r-xl text-white"
                              : "bg-gray-200 rounded-l-xl"
                          }`}
                        >
                          {m.message}
                        </p>
                        <span
                          className={`text-[9px] m${
                            m.senderId !== userId
                              ? "r-auto text-white"
                              : "l-auto text-black"
                          } p-[2px] font-semibold`}
                        >
                          {formattedHours}:{minute + " " + ampm}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <p className="flex justify-center items-center h-full text-xl font-bold text-gray-400">
                  &darr; No Messages, Send something to start a Conversation
                </p>
              )
            ) : (
              <div className="flex justify-center items-center h-full text-2xl font-bold text-gray-400">
                <div className="group flex gap-1 cursor-pointer hover:text-black">
                  <span className="group-hover:-translate-x-1">&larr;</span>
                  <p>Select a friend to text them</p>
                </div>
              </div>
            )}
          </div>

          <div ref={messageRef} className="w-full">
            {isTyping != null && (
              <p className="bg-red-200 text-red-900 ml-auto">{isTyping}</p>
            )}
          </div>
        </div>
        {selectedUser && (
          <form
            onSubmit={(e) => onSubmit(e)}
            className="p-1 h-[60px] flex items-center justify-center"
          >
            <input
              onChange={(e) => {
                setMessage(e.target.value);
                typing();
              }}
              value={message}
              type="text"
              placeholder="Type your message here"
              className="flex-grow h-full p-2 rounded-lg outline-none bg-gray-500"
            />
            <button
              type="submit"
              className="text-black bg-blue-600 m-2 rounded-2xl hover:bg-blue-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 m-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>

      <div className="hidden md:block w-1/5 bg-gray-500 h-screen">
        <AllUsers
          friends={friends}
          setFriends={setFriends}
          allUsers={allUsers}
          setAllUsers={setAllUsers}
        />
      </div>
    </div>
  );
};

export default Dashboard;
