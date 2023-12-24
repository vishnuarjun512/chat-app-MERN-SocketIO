import axios from "axios";
import React, { useEffect } from "react";
import { MdDelete } from "react-icons/md";

const FriendsSection = ({
  userId,
  setFriends,
  friends,
  selectedUser,
  setSelectedUser,
  activeUsers,
}) => {
  const deleteConversation = async (conversation) => {
    const res = await axios.post(`api/conversation/deleteConversation`, {
      conversationId: conversation._id,
    });

    if (!res.data.error) {
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend._id !== conversation._id)
      );
    }
  };

  const activeUserIds = activeUsers.map((user) => user.userId);

  const usersInConversation = friends.flatMap((conversation) => {
    return conversation.members.filter((member) =>
      activeUserIds.includes(member._id)
    );
  });
  const finalActiveUserIds = usersInConversation.map((user) => user._id);

  return (
    <div className="p-3">
      {userId &&
        friends.map((d, index) => (
          <div
            key={index}
            className={`flex gap-3 justify-center md:justify-between items-center px-3 sm:px-5 md:px-7 mx-1 mb-1 py-1 ${
              selectedUser && selectedUser._id === d._id
                ? "bg-green-500 hover:bg-green-600 "
                : "hover:bg-[#393E46] "
            } rounded-lg cursor-pointer`}
            onClick={() => {
              setSelectedUser(d);
            }}
          >
            <div className="flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2 ">
              <div className="relative">
                <img
                  size={30}
                  className="rounded-full w-[60px] h-[60px]"
                  src="data:image/png;base64,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"
                  alt="User Image"
                />
                {finalActiveUserIds.includes(d.members[0]._id) && (
                  <span className="top-0 right-0 absolute w-4 h-4 md:w-5 md:h-5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                )}
              </div>
              <div>
                {d.members
                  .filter((member) => member !== userId)
                  .map((member, id) => (
                    <div
                      key={id}
                      className="block sm:text-sm md:text-sm text-gray-200 font-bold"
                    >
                      {member.username}
                    </div>
                  ))}
              </div>
            </div>

            <button
              onClick={() => {
                deleteConversation(d);
              }}
              className="lg:block hidden bg-[#AD8B73] hover:text-white p-2 rounded-lg hover:bg-amber-600"
            >
              <MdDelete />
            </button>
          </div>
        ))}
    </div>
  );
};

export default FriendsSection;
