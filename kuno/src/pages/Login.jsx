import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Envelope, Lock, CircleNotch } from '@phosphor-icons/react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-warm-bg dark:bg-dark-bg relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2C2416 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl font-serif italic text-warm-accent">Kuno</h2>
          <p className="mt-2 text-warm-muted dark:text-dark-muted">Welcome back to your library</p>
        </div>

        {error && (
          <div className="p-4 bg-warm-rose/10 text-warm-rose text-sm rounded-xl border border-warm-rose/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Envelope className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-muted" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-surface border border-warm-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-accent/20 transition-all text-warm-text dark:text-dark-text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-muted" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-surface border border-warm-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-accent/20 transition-all text-warm-text dark:text-dark-text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-sm text-warm-accent hover:underline">Forgot password?</button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-warm-accent text-white py-4 rounded-xl font-bold shadow-lg shadow-warm-accent/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? <CircleNotch className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-warm-muted dark:text-dark-muted">
            Don't have an account? {' '}
            <Link to="/register" className="text-warm-accent font-bold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
