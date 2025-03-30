import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';  // Import Link for navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Sign Up') {
      const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        toast.error(data.message);
      }
    } else {
      const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        toast.error(data.message);
      }
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment</p>

        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Full Name</p>
            <div className="flex items-center border border-[#DADADA] rounded w-full mt-1">
              <FontAwesomeIcon icon={faUser} className="p-2 text-gray-400" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className='flex-1 p-2 outline-none'
                type="text"
                required
              />
            </div>
          </div>
        )}

        <div className='w-full'>
          <p>Email</p>
          <div className="flex items-center border border-[#DADADA] rounded w-full mt-1">
            <FontAwesomeIcon icon={faEnvelope} className="p-2 text-gray-400" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='flex-1 p-2 outline-none'
              type="email"
              required
            />
          </div>
        </div>

        <div className='w-full'>
          <p>Password</p>
          <div className="flex items-center border border-[#DADADA] rounded w-full mt-1">
            <FontAwesomeIcon icon={faLock} className="p-2 text-gray-400" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='flex-1 p-2 outline-none'
              type="password"
              required
            />
          </div>
          {state === 'Login' && (
            <div className="w-full text-right mt-2">
              <Link to="/User-forgot-password" className="text-primary text-sm underline">
                Forgot Password?
              </Link>
            </div>
          )}
        </div>

        <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>
          {state === 'Sign Up' ? 'Create account' : 'Login'}
        </button>

        {state === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{' '}
            <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
