import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const genratedRefreshToken = async (userId) => {
  const token = await jwt.sign({ id: userId }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });

  const updateRefreshToken = await UserModel.updateOne(
    { _id: userId },
    { refresh_token: token }
  );
  return token;
};

export default genratedRefreshToken;
