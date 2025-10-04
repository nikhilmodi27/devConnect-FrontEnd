import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../utils/constants";
import axios from "axios";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
import type { ConnectionRequest } from "../types/connectionRequest";

const Requests = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const requests = useSelector(
    (store: { requests: ConnectionRequest[] }) => store.requests
  );

  const reviewRequest = async (
    status: "accepted" | "rejected",
    requestId: string
  ) => {
    try {
      setActionLoading(requestId);

      await axios.post(
        `${API_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error("Error reviewing request:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const fetchRequests = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get(`${API_URL}/user/requests/received`, {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-20">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center my-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">No Requests Found</h1>
          <p className="text-base-content/60">
            You don't have any pending connection requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Connection Requests</h1>
        <p className="text-base-content/60">
          {requests.length} pending request{requests.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {requests.map((request) => {
          const { _id: requestId } = request;
          const { firstName, lastName, photoUrl, age, gender, about } =
            request.fromUserId;

          return (
            <div
              key={requestId}
              className="flex items-center justify-between p-6 rounded-lg bg-base-300 shadow-sm"
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

              <div className="flex space-x-2">
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => reviewRequest("rejected", requestId)}
                  disabled={actionLoading === requestId}
                >
                  {actionLoading === requestId ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Reject"
                  )}
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => reviewRequest("accepted", requestId)}
                  disabled={actionLoading === requestId}
                >
                  {actionLoading === requestId ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Accept"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
