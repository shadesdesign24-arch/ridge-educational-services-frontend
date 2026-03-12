import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL, BASE_URL } from '../constants';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = `${API_URL}/auth/login`;
      const payload = { email, password };
      
      const res = await axios.post(endpoint, payload);
      
      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('role', res.data.role);
      
      if (res.data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center p-6 selection:bg-accent/30 font-sans transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 p-10 md:p-14"
      >
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-display font-black text-primary dark:text-white tracking-tighter mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">
            Login to access your dashboard
          </p>
        </div>

        {error && <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-500 text-sm font-bold text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-5 px-6 text-primary dark:text-white focus:ring-2 focus:ring-accent transition-all text-sm font-bold"
              placeholder="admin@ridgeedu.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-5 px-6 text-primary dark:text-white focus:ring-2 focus:ring-accent transition-all text-sm font-bold"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-primary text-white font-black py-5 rounded-3xl shadow-2xl shadow-primary/30 transition-all text-sm uppercase tracking-[0.2em] mt-8"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Auth;
