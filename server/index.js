import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// In-memory user storage (replace with database in production)
const users = new Map();

// Initialize demo users
const demoUsers = [
  {
    id: '1',
    username: 'mrpitzo_admin',
    email: process.env.DEMO_EMAIL || 'mrpitzo@rhythmrockets.com',
    passwordHash: bcrypt.hashSync(process.env.PASSWORD_MRPITZO_ADMIN || 'Rr!2026#Pitzo$Studio91', 10),
    role: 'admin',
    createdAt: new Date()
  },
  {
    id: '2',
    username: 'mrpitzo_music',
    email: process.env.DEMO_MUSIC_EMAIL || 'music@rhythmrockets.com',
    passwordHash: bcrypt.hashSync(process.env.PASSWORD_MRPITZO_MUSIC || 'Rhythm@Rockets#Create88', 10),
    role: 'studio_user',
    createdAt: new Date()
  },
  {
    id: '3',
    username: 'pitzo_dev',
    email: process.env.DEMO_DEV_EMAIL || 'dev@rhythmrockets.com',
    passwordHash: bcrypt.hashSync(process.env.PASSWORD_PITZO_DEV || 'Build!AI$Studio2026#', 10),
    role: 'developer',
    createdAt: new Date()
  }
];

// Initialize users map
demoUsers.forEach(user => {
  users.set(user.username, user);
});

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';
const JWT_EXPIRES = '24h';

// Middleware: Verify JWT Token
function verifyToken(req, res, next) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Routes

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    if (users.has(username)) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      id: Date.now().toString(),
      username,
      email,
      passwordHash,
      role: 'user',
      createdAt: new Date()
    };

    users.set(username, user);

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = users.get(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/verify
app.post('/api/auth/verify', (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      success: true,
      user: {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// POST /api/auth/refresh
app.post('/api/auth/refresh', (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });

    const newToken = jwt.sign(
      { id: decoded.id, username: decoded.username, email: decoded.email, role: decoded.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.cookie('authToken', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ success: true });
  } catch (err) {
    return res.status(401).json({ error: 'Token refresh failed' });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/profile (Protected)
app.get('/api/auth/profile', verifyToken, (req, res) => {
  const user = users.get(req.user.username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  });
});

// POST /api/generate-music (Protected)
app.post('/api/generate-music', verifyToken, (req, res) => {
  try {
    const { title, description, genre } = req.body;

    if (!title || !description || !genre) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const track = {
      id: Date.now().toString(),
      title,
      description,
      genre,
      status: 'generating',
      createdAt: new Date(),
      createdBy: req.user.username
    };

    res.json({
      success: true,
      track,
      message: 'Music generation started'
    });
  } catch (error) {
    console.error('Music generation error:', error);
    res.status(500).json({ error: 'Music generation failed' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

export default app;
