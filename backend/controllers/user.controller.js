import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const profile = (req, res, err) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      res.status(200).json({ username: null, message: "No token" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.status(200).json({
        username: data.username,
        id: data.userId,
        message: "User Logged In Already",
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const friends = await User.find();
    const data = friends.map((friend) => {
      return {
        username: friend.username,
        _id: friend._id,
        email: friend.email,
      };
    });
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const friends = await User.find({ _id: userId });
    res.status(200).json({ friends });
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (req, res, err) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    const checkUser = await User.findOne({ $or: [{ username }, { email }] });
    if (checkUser) {
      const checkPassword = bcryptjs.compareSync(password, checkUser.password);
      if (checkPassword) {
        const token = jwt.sign(
          { userId: checkUser._id, username },
          process.env.JWT_SECRET
        );
        return res
          .cookie("auth_token", token, { httpOnly: true })
          .status(200)
          .json({
            message: "Login Success",
            user: username,
            id: checkUser._id,
          });
      } else {
        return res.status(201).json({ error: "Credentials dont match" });
      }
    }

    res.status(201).json({ error: "User not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const registerUser = async (req, res, err) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    const data = await User.findOne({ email: email });
    if (data) {
      return res.status(201).json({ error: "User already registered" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      email: email,
      username: username,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    console.log("saved user", savedUser);
    res.status(200).json({ message: "Register Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("auth_token")
      .status(200)
      .json({ message: "Deleted Cookie" });
  } catch (error) {
    console.log(error);
  }
};
