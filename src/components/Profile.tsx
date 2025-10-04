import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import type { User } from "../types/user";

const Profile = () => {
  const user = useSelector((store: { user: User | null }) => store.user);

  return (
    user && (
      <div>
        <EditProfile user={user} />
      </div>
    )
  );
};
export default Profile;
