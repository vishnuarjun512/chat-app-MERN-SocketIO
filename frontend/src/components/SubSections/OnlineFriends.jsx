import React from "react";

const OnlineFriends = ({ activeUsers, userId }) => {
  return (
    <div className="bg-blue-300 p-3 w-full">
      {activeUsers.map((user) => {
        return (
          <p key={user.userId}>{user.userId !== userId ? user.username : ""}</p>
        );
      })}
    </div>
  );
};

export default OnlineFriends;
