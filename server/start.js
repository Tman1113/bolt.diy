import app from './index.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║      Rhythm Rockets AI Studio - Auth Server           ║
║                                                       ║
║  Server running on http://localhost:${PORT}         ║
║  Environment: ${process.env.NODE_ENV || 'development'}                    ║
║                                                       ║
║  Demo Users Available:                                ║
║  • mrpitzo_admin (Admin)                             ║
║  • mrpitzo_music (Studio User)                       ║
║  • pitzo_dev (Developer)                             ║
║                                                       ║
║  Features:                                            ║
║  ✓ JWT Authentication                                ║
║  ✓ Bcrypt Password Hashing                           ║
║  ✓ HTTP-Only Secure Cookies                          ║
║  ✓ Protected Endpoints                               ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});
