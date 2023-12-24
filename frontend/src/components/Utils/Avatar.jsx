import React from "react";

const Avatar = ({ username, userId }) => {
  const colors = [
    "bg-red-200",
    "bg-green-800",
    "bg-purple-200",
    "bg-pink-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-orange-200",
    "bg-teal-300",
  ];

  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-3 p-3">
      <div
        className={`h-20 md:h-[60px] w-20 md:w-[60px] hover:scale-105 uppercase font-bold text-2xl md:text-xl border-b-4 border-${
          color?.split("-")[1]
        }-600 ${color} rounded-full flex justify-center items-center`}
      >
        {username?.slice(0, 1)}
      </div>
      <div className="text-center flex flex-col gap-1">
        <p className="font-bold text-[#DBE2EF] uppercase text-xl whitespace-nowrap cursor-pointer">
          {username}
        </p>
        <div className="font-semibold flex gap-1 text-gray-400 group text-sm cursor-pointer ">
          <p className="group-hover:text-white">Settings</p>
          <span className="group-hover:translate-x-1 group-hover:text-white transition-all duration-100 ease-in-out">
            &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
