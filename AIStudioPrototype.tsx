export default function AIStudioPrototype() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="mb-8">
          <p className="text-sm text-slate-400 mb-2">www.rhythmrockets.studio</p>
          <h1 className="text-4xl font-bold">Rhythm Rockets AI Studio</h1>
        </div>
        <p className="text-slate-300">AI music generation studio with full copyright ownership for Mr Pitzo.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Generate Music</h2>
            <input className="w-full p-3 rounded bg-slate-800 mb-3" placeholder="Song title" />
            <textarea className="w-full p-3 rounded bg-slate-800 mb-3" rows="5" placeholder="Describe your song (genre, mood, instruments)..." />
            <select className="w-full p-3 rounded bg-slate-800 mb-3">
              <option>Gospel</option>
              <option>Amapiano</option>
              <option>Hip Hop</option>
              <option>Instrumental</option>
            </select>
            <button className="px-6 py-3 bg-blue-600 rounded-xl">Generate Track</button>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Your Login Details</h2>
            <div className="space-y-3 text-slate-300 text-sm">
              <p><strong>Admin:</strong> mrpitzo_admin</p>
              <p><strong>Email:</strong> tpitso78@gmail.com</p>
              <p><strong>Password:</strong> Rr!2026#Pitzo$Studio91</p>
              <hr className="border-slate-700" />
              <p><strong>Studio User:</strong> mrpitzo_music</p>
              <p><strong>Password:</strong> Rhythm@Rockets#Create88</p>
              <hr className="border-slate-700" />
              <p><strong>Developer:</strong> pitzo_dev</p>
              <p><strong>Password:</strong> Build!AI$Studio2026#</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Copyright Protection</h2>
          <ul className="space-y-2 text-slate-300">
            <li>✓ 100% ownership stays with you</li>
            <li>✓ Automatic timestamp certificate</li>
            <li>✓ Export license PDF</li>
            <li>✓ Private cloud storage</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
