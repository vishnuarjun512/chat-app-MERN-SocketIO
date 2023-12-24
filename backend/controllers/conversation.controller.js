import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const createConversation = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.body;
    if (senderId === receiverId) {
      console.log("Sender Receiver Same");
      return res.status(200).send("Sender Receiver Same");
    }

    const conversationCheck = await Conversation.find({
      members: { $all: [senderId, receiverId] },
    });

    if (conversationCheck.length > 0) {
      console.log("Conversation Already Exists");
      return res.status(200).send("Conversation Already Exists");
    } else {
      const newConverstaion = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    const userId = senderId;
    const conversations = await Conversation.find({
      members: {
        $all: [userId],
      },
    });

    // My Logic to give back the Conversation with users in the Members
    const findUsers = [];
    for (const conversation of conversations) {
      const totalMembers = [];

      await Promise.all(
        conversation.members.map(async (member) => {
          if (member.toString() !== userId.toString()) {
            const users = await User.findById(member);
            const user = Array.isArray(users) ? users[0] : users;
            const { password: pass, ...rest } = user._doc;
            totalMembers.push(rest);
          }
        })
      );

      findUsers.push({ _id: conversation._id, members: totalMembers });
    }
    return res.status(200).json({
      message: "Conversation created Successfully",
      findUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Internal Server Error -> ", error);
  }
};

export const deleteConversation = async (req, res, next) => {
  try {
    const conversationId = req.body.conversationId;
    const foundConversation = await Conversation.findByIdAndDelete(
      conversationId
    );
    const deleteMessages = await Message.deleteMany({ conversationId });
    if (foundConversation && deleteConversation) {
      res.status(200).json({ message: "Deleted Successful" });
    } else {
      res.status(200).json({ error: "Deleted Unsuccessful" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Internal Serveer Error");
  }
};

export const getAllFriends = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const conversations = await Conversation.find({
      members: {
        $all: [userId],
      },
    });

    // My Logic to give back the Conversation with users in the Members
    const findUsers = [];
    for (const conversation of conversations) {
      const totalMembers = [];

      await Promise.all(
        conversation.members.map(async (member) => {
          if (member.toString() !== userId.toString()) {
            const users = await User.findById(member);
            const user = Array.isArray(users) ? users[0] : users;
            const { password: pass, ...rest } = user._doc;
            totalMembers.push(rest);
          }
        })
      );

      findUsers.push({ _id: conversation._id, members: totalMembers });
    }

    return res.status(200).json({ findUsers });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Internal Server Error");
  }
};

export const createMessage = async (req, res, next) => {
  try {
    const { conversationId, senderId, message, receiverId } = req.body;
    const newMessage = new Message({
      conversationId,
      senderId,
      message,
      receiverId,
    });
    await newMessage.save();
    return res.status(200).json({ message: "Message Created", newMessage });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Internal Server Error");
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const conversationId = req.params.conversationId;
    const messages = await Message.find({ conversationId });
    return res.status(200).json({ message: "Got all Messages", messages });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Internal Server Error");
  }
};
