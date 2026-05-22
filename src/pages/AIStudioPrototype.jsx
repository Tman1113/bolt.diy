import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, fetchWithAuth } from '../hooks/useAuth';

export default function AIStudioPrototype() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Gospel'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState([]);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateMusic = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setMessage('');

    try {
      const response = await fetchWithAuth('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate music');
      }

      const data = await response.json();
      
      if (data.success) {
        setGeneratedTracks(prev => [data.track, ...prev]);
        setFormData({ title: '', description: '', genre: 'Gospel' });
        setMessage('✓ Music generation started! Your track is being created...');
      }
    } catch (error) {
      setMessage('✗ Error: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with User Info */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Rhythm Rockets AI Studio</h1>
            <p className="text-slate-300">AI music generation with full copyright ownership</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Logged in as:</p>
            <p className="text-blue-400 font-semibold">{user?.username}</p>
            <p className="text-slate-500 text-xs capitalize">{user?.role}</p>
            <button
              onClick={handleLogout}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.startsWith('✓') 
              ? 'bg-green-900/30 border border-green-600 text-green-200' 
              : 'bg-red-900/30 border border-red-600 text-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Music Generation Form */}
          <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Generate Music</h2>
            <form onSubmit={handleGenerateMusic} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Song Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500 transition"
                  placeholder="Enter song title"
                  required
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500 transition"
                  rows="4"
                  placeholder="Describe your song (genre, mood, instruments, tempo...)"
                  required
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Genre</label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500 transition"
                  disabled={isGenerating}
                >
                  <option>Gospel</option>
                  <option>Amapiano</option>
                  <option>Hip Hop</option>
                  <option>Instrumental</option>
                  <option>Jazz</option>
                  <option>Electronic</option>
                  <option>Ambient</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-xl font-semibold transition"
              >
                {isGenerating ? 'Generating...' : 'Generate Track'}
              </button>
            </form>
          </div>

          {/* User Profile & Info */}
          <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
            <div className="space-y-3 text-slate-300 text-sm">
              <div>
                <p className="text-slate-500 text-xs">Username</p>
                <p className="font-semibold text-white">{user?.username}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Email</p>
                <p className="font-semibold text-white">{user?.email}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Role</p>
                <p className="font-semibold text-white capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Member Since</p>
                <p className="font-semibold text-white">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <hr className="border-slate-700 my-4" />
              <div className="text-xs text-slate-400">
                <p>✓ All credentials are securely managed</p>
                <p>✓ Your session is encrypted</p>
                <p>✓ Automatic logout after 24 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Protection */}
        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Copyright Protection</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>100% ownership stays with you</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Automatic timestamp certificate</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Export license PDF</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Private cloud storage</span>
              </li>
            </ul>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>No royalties to Rhythm Rockets</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Rights to distribute & monetize</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Commercial use allowed</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Blockchain verification available</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Generated Tracks */}
        {generatedTracks.length > 0 && (
          <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Your Generated Tracks</h2>
            <div className="space-y-3">
              {generatedTracks.map((track) => (
                <div
                  key={track.id}
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-500 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{track.title}</h3>
                      <p className="text-sm text-slate-400">{track.genre}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {track.description.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        track.status === 'generating'
                          ? 'bg-yellow-900/30 text-yellow-300'
                          : track.status === 'completed'
                          ? 'bg-green-900/30 text-green-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        {track.status}
                      </span>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(track.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
