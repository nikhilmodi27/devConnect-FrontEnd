import axios from "axios";
import { useState } from "react";
import { API_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isLoginForm, setIsLoginForm] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.emailId.trim() || !formData.password.trim()) {
      setError("Email and password are required");
      return false;
    }

    if (!isLoginForm) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError("First name and last name are required");
        return false;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailId)) {
        setError("Please enter a valid email address");
        return false;
      }
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const result = await axios.post(
        API_URL + "/auth/login",
        {
          emailId: formData.emailId.trim(),
          password: formData.password,
        },
        { withCredentials: true }
      );

      dispatch(setUser(result.data));
      navigate("/", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        API_URL + "/auth/signup",
        {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          emailId: formData.emailId.trim(),
          password: formData.password,
        },
        { withCredentials: true }
      );

      dispatch(setUser(res.data.data));
      navigate("/profile", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginForm) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  const switchFormMode = () => {
    setIsLoginForm(value => !value);
    setError("");
    setFormData({
      firstName: "",
      lastName: "",
      emailId: "",
      password: "",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">
            {isLoginForm ? "Login" : "Create Account"}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLoginForm && (
                <div className="space-y-2">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">First Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter your first name"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Last Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter your last name"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={formData.emailId}
                  onChange={(e) => handleInputChange("emailId", e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                {!isLoginForm && (
                  <label className="label">
                    <span className="label-text-alt">Minimum 6 characters</span>
                  </label>
                )}
              </div>
            </div>

            {error && (
              <div className="alert alert-error mt-4">
                <span>{error}</span>
              </div>
            )}

            <div className="card-actions justify-center mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : isLoginForm ? (
                  "Login"
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm">
              {isLoginForm ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={switchFormMode}
                className="link link-primary ml-1"
                disabled={isLoading}
              >
                {isLoginForm ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
