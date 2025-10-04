import { useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setUser } from "../utils/userSlice";
import type { User } from "../types/user";

const EditProfile = ({ user }: { user: User }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    photoUrl: user.photoUrl,
    age: user.age || "",
    gender: user.gender || "",
    about: user.about || "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  // const userId = user._id;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const saveProfile = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError("First name and last name are required");
        return;
      }

      if (
        formData.age &&
        (isNaN(Number(formData.age)) || Number(formData.age) < 0)
      ) {
        setError("Age must be a valid number");
        return;
      }

      const updatedData = await axios.patch(
        API_URL + "/profile/edit",
        {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          photoUrl: formData.photoUrl.trim(),
          age: formData.age ? Number(formData.age) : undefined,
          gender: formData.gender.trim() || undefined,
          about: formData.about.trim() || undefined,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(setUser(updatedData.data.data));

      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile();
  };

  return (
    <>
      <div className="flex justify-center my-10">
        <div className="w-full max-w-2xl">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center text-2xl mb-6">
                Edit Profile
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        First Name *
                      </span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="Enter your first name"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Last Name *
                      </span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Enter your last name"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Photo URL
                      </span>
                    </label>
                    <input
                      type="url"
                      className="input input-bordered"
                      value={formData.photoUrl}
                      onChange={(e) =>
                        handleInputChange("photoUrl", e.target.value)
                      }
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Age</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="Enter your age"
                      min="0"
                      max="120"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Gender</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={formData.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text font-semibold">About</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    value={formData.about}
                    onChange={(e) => handleInputChange("about", e.target.value)}
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      {formData.about.length}/500 characters
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="alert alert-error mt-4">
                    <span>{error}</span>
                  </div>
                )}

                <div className="card-actions justify-center mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary w-full md:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Saving...
                      </>
                    ) : (
                      "Save Profile"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
