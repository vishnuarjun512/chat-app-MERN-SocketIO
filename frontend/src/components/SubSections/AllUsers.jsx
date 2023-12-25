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
    <div className="bg-[#31304D] h-screen">
      <h1 className="text-2xl select-none font-bold text-white text-center p-3 rounded-lg border-2">
        Add Friends
      </h1>
      <div className="mt-4">
        {allUsers.map(
          (user, index) =>
            user._id !== userId && (
              <div
                key={index}
                className="w-full cursor-pointer p-2 hover:bg-[#3e3d60] group select-none rounded-lg flex justify-between items-center px-8"
              >
                <p className="text-xl font-semibold text-gray-400 group-hover:text-black">
                  {user.username}
                </p>

                <button
                  onClick={() => {
                    makeConversation(user._id);
                  }}
                  className="p-1 bg-[#31304D] group-hover:bg-[#3e3d60] text-white rounded-lg hover:scale-110"
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
