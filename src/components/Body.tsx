import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { API_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../utils/userSlice";
import { useEffect } from "react";
import type { User } from "../types/user";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((store: { user: User | null }) => store.user);

  const fetchUser = async () => {
    if (userData) return;

    try {
      const response = await axios.get(API_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(setUser(response.data.user));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        navigate("/login", { replace: true });
      } else {
        console.error("Profile fetch error:", err);
      }
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default Body;
