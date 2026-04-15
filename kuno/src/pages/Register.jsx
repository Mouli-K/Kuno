import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Envelope, Lock, User, LockKey, CircleNotch } from '@phosphor-icons/react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(formData.email, formData.password, formData.displayName);
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create an account');
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
          <p className="mt-2 text-warm-muted dark:text-dark-muted">Begin your literary journey</p>
        </div>

        {error && (
          <div className="p-4 bg-warm-rose/10 text-warm-rose text-sm rounded-xl border border-warm-rose/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-muted" size={20} />
            <input 
              name="displayName"
              type="text" 
              placeholder="Display Name" 
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-surface border border-warm-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-accent/20 transition-all text-warm-text dark:text-dark-text"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <Envelope className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-muted" size={20} />
            <input 
              name="email"
              type="email" 
              placeholder="Email Address" 
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-surface border border-warm-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-accent/20 transition-all text-warm-text dark:text-dark-text"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-muted" size={20} />
            <input 
              name="password"
              type="password" 
              placeholder="Password" 
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-surface border border-warm-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-accent/20 transition-all text-warm-text dark:text-dark-text"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <LockKey className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-muted" size={20} />
            <input 
              name="confirmPassword"
              type="password" 
              placeholder="Confirm Password" 
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-surface border border-warm-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-accent/20 transition-all text-warm-text dark:text-dark-text"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-warm-accent text-white py-4 rounded-xl font-bold shadow-lg shadow-warm-accent/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? <CircleNotch className="animate-spin" size={20} /> : 'Create Account'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-warm-muted dark:text-dark-muted">
            Already have an account? {' '}
            <Link to="/login" className="text-warm-accent font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
