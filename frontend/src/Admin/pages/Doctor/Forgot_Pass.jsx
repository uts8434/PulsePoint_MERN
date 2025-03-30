import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Forgot_Pass = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false); // Track email validation
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!showPasswordField) {
      // Step 1: Verify if the email exists
      try {
        console.log("object",email);
        const { data } = await axios.post(backendUrl + "/api/doctor/verify-email", { email });
        console.log("received ");
        if (data.success) {
          toast.success("Email verified! Please enter your new password.");
          setShowPasswordField(true); // Allow user to enter new password
        } else {
          toast.error("Email not found. Please try again.");
        }
      } catch (error) {
        toast.error("Error verifying email. Please try again later.");
      } finally {
        setLoading(false);
      }
    } else {
      // Step 2: Update password if email is verified
      try {
        const { data } = await axios.post(backendUrl + "/api/doctor/reset-password", {
          email,
          password,
        });

        if (data.success) {
          toast.success("Password reset successful! You can now log in.");
          navigate("/admin/admin_login"); // Redirect to login after success
        } else {
          toast.error(data.message || "Password reset failed.");
        }
      } catch (error) {
        toast.error("Error resetting password. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-4 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto text-primary">Forgot Password</p>
        <p className="text-sm text-gray-600">
          {!showPasswordField
            ? "Enter your registered email to reset your password."
            : "Enter a new password for your account."}
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
            disabled={showPasswordField} // Prevent email editing after verification
          />
        </div>

        {showPasswordField && (
          <div className="w-full">
            <p>New Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="password"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-base text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary"
          }`}
        >
          {loading ? "Processing..." : showPasswordField ? "Reset Password" : "Verify Email"}
        </button>

        <p className="mt-2 text-sm">
          Remembered your password?{" "}
          <span
            onClick={() => navigate("/admin/admin_login")}
            className="text-primary underline cursor-pointer"
          >
            Go back to login
          </span>
        </p>
      </div>
    </form>
  );
};

export default Forgot_Pass;
