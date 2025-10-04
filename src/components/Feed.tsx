import axios from "axios";
import { API_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import type { User } from "../types/user";

const Feed = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const feedData = useSelector((store: { feed: User[] }) => store.feed);

  const getFeed = async () => {
    if (feedData.length > 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/user/feed`, {
        withCredentials: true,
      });

      dispatch(addFeed(response.data.data));
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError("Failed to load feed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-20">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center my-10">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
          <button onClick={getFeed} className="btn btn-sm btn-ghost">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (feedData.length === 0) {
    return (
      <div className="flex justify-center my-10">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">No new users found</h1>
          <p className="text-base-content/60">
            Check back later for new connections
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feedData[0]} />
    </div>
  );
};

export default Feed;
