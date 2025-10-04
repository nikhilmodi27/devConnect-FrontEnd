import axios from "axios";
import { API_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import type { User } from "../types/user";
import { useState } from "react";

const UserCard = ({ user }: { user: User }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const handleSendRequest = async (
    status: "ignored" | "interested",
    userId: string
  ) => {
    try {
      setIsLoading(status);
      setError(null);

      await axios.post(
        `${API_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      console.error("Error sending request:", error);
      setError(`Failed to ${status} user. Please try again.`);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="card bg-base-100 w-96 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <figure className="px-6 pt-6">
        <img
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          className="w-32 h-32 rounded-full object-cover border-4 border-base-300"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title text-2xl mb-2">
          {firstName} {lastName}
        </h2>

        {(age || gender) && (
          <div className="badge badge-outline badge-lg">
            {[age, gender].filter(Boolean).join(", ")}
          </div>
        )}

        {about && (
          <p className="text-base-content/80 leading-relaxed my-3 line-clamp-3">
            {about}
          </p>
        )}

        {error && (
          <div className="alert alert-error alert-sm w-full">
            <span>{error}</span>
          </div>
        )}

        <div className="card-actions justify-center mt-4 w-full">
          <button
            className="btn btn-outline btn-error flex-1"
            onClick={() => handleSendRequest("ignored", _id)}
            disabled={isLoading !== null}
          >
            {isLoading === "ignored" ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Ignore"
            )}
          </button>
          <button
            className="btn btn-primary flex-1"
            onClick={() => handleSendRequest("interested", _id)}
            disabled={isLoading !== null}
          >
            {isLoading === "interested" ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Interested"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
