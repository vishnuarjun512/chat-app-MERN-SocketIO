import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { IoIosAddCircle } from "react-icons/io";

const AllUsers = ({ setAllUsers, friends, setFriends, allUsers }) => {
  const userId = useSelector((state) => state.user.userId);

  const makeConversation = async (id) => {
    const res = await axios.post(`/api/conversation`, {
      senderId: userId,
      receiverId: id,
    });

    if (res.data.findUsers) {
      setFriends(res.data.findUsers);
      setAllUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 text-center p-3 rounded-lg border-2">
        Make Friends here
      </h1>
      <div className="mt-4">
        {allUsers.map(
          (user, index) =>
            user._id !== userId && (
              <div
                key={index}
                className="w-full cursor-pointer p-2 hover:bg-gray-400 rounded-lg flex justify-between items-center px-10"
              >
                <p className="text-xl font-semibold uppercase">
                  {user.username}
                </p>
                <button
                  onClick={() => {
                    makeConversation(user._id);
                  }}
                  className="p-1 bg-blue-300 rounded-lg hover:scale-110"
                >
                  <IoIosAddCircle size={25} />
                </button>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default AllUsers;
