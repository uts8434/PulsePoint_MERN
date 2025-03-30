import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserForgotPass = () => {
  const [step, setStep] = useState(1); // Step 1: Verify email, Step 2: Update password
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Step 1: Verify the email address
  const handleEmailVerification = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verifyemail`, { email });
      if (data.success) {
        toast.success('Email verified. Please reset your password.');
        setStep(2); // Move to password reset step
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error verifying email. Please try again.');
    }
  };

  // Step 2: Update the password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords don't match!");
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/user/UpdatePass`, { email, newPassword });
      if (data.success) {
        toast.success('Password updated successfully!');
        navigate('/login'); // Redirect to login after success
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error updating password. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-4 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        {step === 1 && (
          <form onSubmit={handleEmailVerification} className="w-full">
            <p className="text-2xl font-semibold mb-4">Forgot Password</p>
            <p>Enter your registered email to verify your identity and proceed to reset your password.</p>
            <div className="w-full mt-4">
              <p>Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                required
                className="border border-[#DADADA] rounded w-full p-2 outline-none"
              />
            </div>
            <button type="submit" className="bg-primary text-white w-full py-2 my-4 rounded-md text-base">
              Verify Email
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePasswordUpdate} className="w-full">
            <p className="text-2xl font-semibold mb-4">Reset Password</p>
            <p>Enter your new password to reset your account.</p>

            <div className="w-full mt-4">
              <p>New Password</p>
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                type="password"
                required
                className="border border-[#DADADA] rounded w-full p-2 outline-none"
              />
            </div>

            <div className="w-full mt-4">
              <p>Confirm New Password</p>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
                required
                className="border border-[#DADADA] rounded w-full p-2 outline-none"
              />
            </div>

            <button type="submit" className="bg-primary text-white w-full py-2 my-4 rounded-md text-base">
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserForgotPass;
