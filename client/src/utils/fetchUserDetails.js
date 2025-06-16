import axios from "axios";

const fetchUserDetails = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await axios.get(
      "https://bazarya-theta.vercel.app/api/user/user-details",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching user details:", error);
    return null;
  }
};

export default fetchUserDetails;
