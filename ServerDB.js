const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const validator = require("validator");
const rateLimit = require("express-rate-limit");
const winston = require("winston");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 5000;

// Secret key for JWT (should be stored in environment variable)
const JWT_SECRET = "your_jwt_secret_key_here_replace_in_production";

// Chuỗi kết nối với mật khẩu đã được mã hóa
const password = encodeURIComponent("Admin123456");
const uri = `mongodb+srv://admin:${password}@cluster0.xljpiwa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log("Đang kết nối đến MongoDB...");
mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Kết nối MongoDB thành công!");
    // Không cần process.exit ở đây
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối MongoDB:", err);
    process.exit(1);
  });

// Enhanced User Schema with validation
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "Users" }
);

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const vocabularySchema = new mongoose.Schema(
  {
    word: { type: String, required: true },
    pinyin: String,
    meaning: { type: String, required: true },
    category: String,
  },
  { collection: "Vocabulary" }
);

const Vocabulary = mongoose.model("Vocabulary", vocabularySchema);

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

const flashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    word: { type: String, required: true },
    pinyin: String,
    meaning: { type: String, required: true },
    example: String,
    exampleMeaning: String,
    image: String,
    category: String,
    level: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "Flashcards" }
);

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

// Schema for Learned Words
const learnedWordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flashcard",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "LearnedWords" }
);

const LearnedWord = mongoose.model("LearnedWord", learnedWordSchema);

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());
app.use(helmet()); // Thêm các security headers
app.use(helmet.noSniff()); // Ngăn MIME sniffing
app.use(helmet.xssFilter()); // Bảo vệ XSS

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 request từ mỗi IP
  message: "Too many requests from this IP, please try again later",
});

// Áp dụng rate limiting cho route auth
app.use("/auth", limiter);

// Logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({
      message: "Lỗi xác thực",
      errors: messages,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "Email này đã tồn tại trong hệ thống",
    });
  }

  res.status(500).json({
    message: "Đã xảy ra lỗi, vui lòng thử lại sau",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
};

/* ======== Authentication Routes ======== */

const refreshTokens = new Set();

// Registration route
app.post("/auth/register", async (req, res, next) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Kiểm tra độ dài họ tên
    if (fullName.length < 2) {
      return res.status(400).json({
        message: "Họ và tên phải có ít nhất 2 ký tự",
      });
    }

    // Kiểm tra email hợp lệ
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message:
          "Email không hợp lệ. Vui lòng nhập đúng định dạng email (vd: example@gmail.com)",
      });
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      });
    }

    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Mật khẩu xác nhận không khớp",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email này đã được sử dụng" });
    }

    // Tạo người dùng mới
    const newUser = new User({
      fullName,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản thành công",
    });
  } catch (error) {
    next(error);
  }
});

// Login user
app.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    refreshTokens.add(refreshToken);

    res.json({
      message: "Đăng nhập thành công",
      token,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token route
app.post("/auth/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  try {
    const user = jwt.verify(refreshToken, JWT_SECRET);
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "Bạn cần đăng nhập để tiếp tục" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
      });
    }
    req.user = user;
    next();
  });
};

// Example of a protected route
app.get("/protected", authenticateToken, (req, res) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user,
  });
});

app.post("/api/flashcards", authenticateToken, async (req, res, next) => {
  try {
    const {
      word,
      pinyin,
      meaning,
      example,
      exampleMeaning,
      image,
      category,
      level,
    } = req.body;

    if (!word || !meaning) {
      return res.status(400).json({ message: "Từ và nghĩa là bắt buộc" });
    }

    const newFlashcard = new Flashcard({
      userId: req.user.id,
      word,
      pinyin,
      meaning,
      example,
      exampleMeaning,
      image,
      category,
      level,
    });

    await newFlashcard.save();
    res.status(201).json({
      message: "Thêm flashcard thành công",
      flashcard: newFlashcard,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/api/flashcards", authenticateToken, async (req, res, next) => {
  try {
    const flashcards = await Flashcard.find({ userId: req.user.id });
    res.json({ flashcards });
  } catch (err) {
    next(err);
  }
});

// GET /api/learned
app.post("/api/learned", authenticateToken, async (req, res) => {
  const { wordId } = req.body;

  // Kiểm tra từ đã tồn tại trong Vocabulary
  const word = await Vocabulary.findById(wordId);
  if (!word) {
    return res.status(404).json({ message: "Từ không tồn tại" });
  }

  // Kiểm tra nếu từ đã học rồi
  const exists = await LearnedWord.findOne({
    userId: req.user.id,
    wordId: wordId,
  });

  if (exists) {
    return res.status(200).json({ success: true, message: "Đã học rồi" });
  }

  // Tạo từ đã học mới
  await LearnedWord.create({ userId: req.user.id, wordId });
  res.json({ success: true });
});

// GET /api/learned/count
app.get("/api/learned/count", authenticateToken, async (req, res) => {
  const count = await LearnedWord.countDocuments({ userId: req.user.id });
  res.json({ count });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    next();
  };
};

// Apply error handling middleware
app.use(errorHandler);

/* ======== Start Server ======== */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Export for potential testing
module.exports = { app, User };

// Gọi khi người dùng học xong một từ (ví dụ trong StudyScreen.js)
const markWordAsLearned = async (wordId, token) => {
  try {
    await fetch("http://192.168.1.132:5000/api/learned", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ wordId }),
    });
    // Có thể cập nhật UI hoặc thông báo thành công ở đây
  } catch (error) {
    console.log("Lỗi khi lưu từ đã học:", error);
  }
};

app.get("/api/vocabulary", async (req, res, next) => {
  try {
    const vocabList = await Vocabulary.find({});
    res.json({ data: vocabList });
  } catch (err) {
    next(err);
  }
});

const fetchVocabulary = async () => {
  try {
    const res = await fetch("http://192.168.1.132:5000/api/vocabulary");
    const data = await res.json();
    console.log("Từ vựng:", data.data);
  } catch (error) {
    console.error("Lỗi khi lấy từ vựng:", error);
  }
};

app.get("/api/vocabulary/category/:name", async (req, res, next) => {
  try {
    const { name } = req.params;
    const vocabList = await Vocabulary.find({ category: name });
    res.json({ data: vocabList });
  } catch (err) {
    next(err);
  }
});
