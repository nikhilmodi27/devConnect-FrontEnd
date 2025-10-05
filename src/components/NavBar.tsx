import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../utils/userSlice";
import { API_URL } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../types/user";
import appLogo from "../assets/devConnect.png";

const NavBar = () => {
  const userData = useSelector((store: { user: User | null }) => store.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      dispatch(clearUser());
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          <img
            src={appLogo}
            alt="DevConnect Logo"
            className="w-22 h-20 mr-2 dark:invert" // Proper sizing and spacing
          />
        </Link>
      </div>
      {userData && (
        <div className="flex-none gap-2">
          <div className="form-control">Welcome, {userData.firstName}</div>
          <div className="dropdown dropdown-end mx-5">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="User photo" src={userData.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <a onClick={handleLogOut}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
