import axios from "axios";
import { API_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import type { User } from "../types/user";

const Connections = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const connections = useSelector(
    (store: { connections: User[] }) => store.connections
  );

  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await axios.get(API_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(result.data.data));
    } catch (err) {
      console.error("Error fetching connections:", err);
      setError("Failed to load connections");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
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
          <button onClick={fetchConnections} className="btn btn-sm btn-ghost">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="text-center my-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-base-content mb-4">
            No Connections Found
          </h1>
          <p className="text-base-content/60 mb-6">
            Start connecting with other developers to see them here.
          </p>
          <Link to="/feed" className="btn btn-primary">
            Find Connections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="text-center mb-8">
        <h1 className="font-bold text-3xl mb-2">Connections</h1>
        <p className="text-base-content/60">
          {connections.length} connection{connections.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {connections.map((connection) => {
          const { _id, firstName, lastName, age, gender, photoUrl, about } =
            connection;

          return (
            <div
              key={_id}
              className="flex items-center justify-between p-6 rounded-lg bg-base-300 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-shrink-0">
                  <img
                    alt={`${firstName} ${lastName}`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-base-100"
                    src={photoUrl}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-xl truncate">
                    {firstName} {lastName}
                  </h2>
                  {(age || gender) && (
                    <p className="text-base-content/60 text-sm">
                      {[age, gender].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {about && (
                    <p className="text-base-content/80 mt-1 line-clamp-2">
                      {about}
                    </p>
                  )}
                </div>
              </div>
              <Link to={`/chat/${_id}`}>
                <button className="btn btn-primary btn-sm sm:btn-md">
                  Chat
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
