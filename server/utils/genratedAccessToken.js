import jwt from "jsonwebtoken";

const genratedAccessToken = async (userId) => {
  const token = await jwt.sign({ id: userId }, process.env.SECRET_KEY, {
    expiresIn: "10h",
  });
  return token;
};

export default genratedAccessToken;
