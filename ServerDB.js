const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const validator = require('validator');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const helmet = require('helmet');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 5000;

// Secret key for JWT (should be stored in environment variable)
const JWT_SECRET = 'your_jwt_secret_key_here_replace_in_production';

// Chuỗi kết nối với mật khẩu đã được mã hóa
const password = encodeURIComponent('Admin123456');
const uri = `mongodb+srv://admin:${password}@cluster0.xljpiwa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log('Đang kết nối đến MongoDB...');
mongoose.connect(uri)
  .then(() => {
    console.log('✅ Kết nối MongoDB thành công!');
    // Không cần process.exit ở đây
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối MongoDB:', err);
    process.exit(1);
  });


// Enhanced User Schema with validation
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'Users' });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(helmet()); // Thêm các security headers
app.use(helmet.noSniff()); // Ngăn MIME sniffing
app.use(helmet.xssFilter()); // Bảo vệ XSS

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // Giới hạn 100 request từ mỗi IP
    message: 'Too many requests from this IP, please try again later'
});

// Áp dụng rate limiting cho route auth
app.use('/auth', limiter);

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
  
  console.error(err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({ 
      message: 'Validation Error', 
      errors: messages 
    });
  }

  // Handle duplicate key error (for unique fields like email)
  if (err.code === 11000) {
    return res.status(409).json({ 
      message: 'Email already exists' 
    });
  }

  // Generic server error
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message 
  });
};

/* ======== Authentication Routes ======== */

const refreshTokens = new Set();

// Register new user
app.post('/auth/register', async (req, res, next) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Validate input
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password
    });

    // Save user to database
    await newUser.save();

    // Respond with success (exclude password)
    const userResponse = {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
});

// Login user
app.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    refreshTokens.add(refreshToken);

    // Respond with token and user info
    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token route
app.post('/auth/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken || !refreshTokens.has(refreshToken)) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    try {
        const user = jwt.verify(refreshToken, JWT_SECRET);
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Example of a protected route
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Access granted to protected route',
    user: req.user 
  });
});

// Validation middleware
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'Validation Error',
                errors: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Flash Card API',
            version: '1.0.0',
            description: 'Flash Card Application API'
        }
    },
    apis: ['./ServerDB.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Apply error handling middleware
app.use(errorHandler);

/* ======== Start Server ======== */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Export for potential testing
module.exports = { app, User };