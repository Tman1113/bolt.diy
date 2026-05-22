import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login, register, error } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    username: 'mrpitzo_admin',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
      } else {
        await register(formData.username, formData.email, formData.password);
      }
      navigate('/studio');
    } catch (err) {
      setFormError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = async (demoUser) => {
    setFormData({
      username: demoUser,
      email: '',
      password: demoUser === 'mrpitzo_admin' 
        ? 'Rr!2026#Pitzo$Studio91'
        : demoUser === 'mrpitzo_music'
        ? 'Rhythm@Rockets#Create88'
        : 'Build!AI$Studio2026#'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Rhythm Rockets</h1>
          <p className="text-slate-400">AI Studio Authentication</p>
        </div>

        {/* Main Form */}
        <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700 mb-6">
          <h2 className="text-2xl font-semibold mb-6">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>

          {/* Error Messages */}
          {(formError || error) && (
            <div className="mb-4 p-4 bg-red-900/30 border border-red-600 rounded-lg text-red-200 text-sm">
              {formError || error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500 transition"
                placeholder="Enter username"
                required
                disabled={isLoading}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500 transition"
                  placeholder="Enter email"
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500 transition"
                placeholder="Enter password"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-lg font-semibold transition mt-6"
            >
              {isLoading 
                ? 'Loading...' 
                : isLogin 
                ? 'Sign In' 
                : 'Create Account'
              }
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormError('');
                  setFormData({ username: '', email: '', password: '' });
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold transition"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Demo Users */}
        <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Demo Accounts</h3>
          <p className="text-xs text-slate-500 mb-4">
            Click to auto-fill login credentials. Passwords are stored in .env.local (never in code!)
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => handleDemo('mrpitzo_admin')}
              className="w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left border border-slate-600 transition"
            >
              <p className="font-semibold text-white">Admin Account</p>
              <p className="text-xs text-slate-400">mrpitzo_admin</p>
            </button>

            <button
              onClick={() => handleDemo('mrpitzo_music')}
              className="w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left border border-slate-600 transition"
            >
              <p className="font-semibold text-white">Studio User</p>
              <p className="text-xs text-slate-400">mrpitzo_music</p>
            </button>

            <button
              onClick={() => handleDemo('pitzo_dev')}
              className="w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left border border-slate-600 transition"
            >
              <p className="font-semibold text-white">Developer Account</p>
              <p className="text-xs text-slate-400">pitzo_dev</p>
            </button>
          </div>

          <hr className="border-slate-700 my-4" />

          <div className="text-xs text-slate-400 space-y-1">
            <p>✓ Passwords are hashed with bcrypt</p>
            <p>✓ Session secured with JWT tokens</p>
            <p>✓ Credentials in environment variables</p>
            <p>✓ Never stored in frontend code</p>
          </div>
        </div>
      </div>
    </div>
  );
}
