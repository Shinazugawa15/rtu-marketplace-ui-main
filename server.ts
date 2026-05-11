import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import multer from "multer";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("rtu_marketplace.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    avatar TEXT,
    bio TEXT,
    is_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    icon TEXT
  );

  CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    seller_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category_id TEXT NOT NULL,
    condition TEXT,
    location TEXT,
    images TEXT, -- JSON array
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(seller_id) REFERENCES users(id),
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    listing_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read INTEGER DEFAULT 0,
    FOREIGN KEY(sender_id) REFERENCES users(id),
    FOREIGN KEY(receiver_id) REFERENCES users(id),
    FOREIGN KEY(listing_id) REFERENCES listings(id)
  );

  CREATE TABLE IF NOT EXISTS favorites (
    user_id TEXT NOT NULL,
    listing_id TEXT NOT NULL,
    PRIMARY KEY(user_id, listing_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(listing_id) REFERENCES listings(id)
  );
`);

// Seed initial categories if empty
const categoryCount = db.prepare("SELECT count(*) as count FROM categories").get() as { count: number };
if (categoryCount.count === 0) {
  const insertCategory = db.prepare("INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)");
  const categories = [
    ["1", "Books & Study Materials", "BookOpen"],
    ["2", "Electronics & Gadgets", "Laptop"],
    ["3", "Fashion & Apparel", "Shirt"],
    ["4", "Dorm Essentials", "Home"],
    ["5", "Food & Snacks", "Coffee"],
    ["6", "Services & Tutoring", "GraduationCap"],
    ["7", "Others", "MoreHorizontal"]
  ];
  categories.forEach(cat => insertCategory.run(...cat));
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  
  // Storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/uploads"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
  });
  const upload = multer({ storage });

  // Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || "super-secret-rtu-token", (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Auth APIs
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!email.endsWith("@rtu.edu.ph") && !email.endsWith("@gmail.com")) { // Flexible for demo
      return res.status(400).json({ error: "Please use your student email." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = Date.now().toString();
    try {
      db.prepare("INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)").run(id, name, email, hashedPassword);
      const token = jwt.sign({ id, email, name }, process.env.JWT_SECRET || "super-secret-rtu-token");
      res.json({ token, user: { id, name, email } });
    } catch (e) {
      res.status(400).json({ error: "User already exists." });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET || "super-secret-rtu-token");
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });

  // Listings APIs
  app.get("/api/listings", (req, res) => {
    const { category, search, sort } = req.query;
    let query = "SELECT l.*, u.name as seller_name, u.avatar as seller_avatar, c.name as category_name FROM listings l JOIN users u ON l.seller_id = u.id JOIN categories c ON l.category_id = c.id WHERE l.status = 'active'";
    const params: any[] = [];

    if (category) {
      query += " AND l.category_id = ?";
      params.push(category);
    }
    if (search) {
      query += " AND (l.title LIKE ? OR l.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (sort === "price_asc") query += " ORDER BY l.price ASC";
    else if (sort === "price_desc") query += " ORDER BY l.price DESC";
    else query += " ORDER BY l.created_at DESC";

    const listings = db.prepare(query).all(...params);
    res.json(listings.map((l: any) => ({ ...l, images: JSON.parse(l.images || '[]') })));
  });

  app.post("/api/listings", authenticateToken, (req: any, res) => {
    const { title, description, price, category_id, condition, location, images } = req.body;
    const id = Date.now().toString();
    db.prepare("INSERT INTO listings (id, seller_id, title, description, price, category_id, condition, location, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
      id, req.user.id, title, description, price, category_id, condition, location, JSON.stringify(images)
    );
    res.json({ id, message: "Listing created!" });
  });

  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  // Chat APIs
  app.get("/api/messages", authenticateToken, (req: any, res) => {
    const { listing_id, other_id } = req.query;
    const messages = db.prepare(`
      SELECT * FROM messages 
      WHERE listing_id = ? 
      AND ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
      ORDER BY created_at ASC
    `).all(listing_id, req.user.id, other_id, other_id, req.user.id);
    res.json(messages);
  });

  // Real-time with Socket.io
  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("message", (msg) => {
      const { sender_id, receiver_id, listing_id, content } = msg;
      const id = Date.now().toString();
      db.prepare("INSERT INTO messages (id, sender_id, receiver_id, listing_id, content) VALUES (?, ?, ?, ?, ?)").run(id, sender_id, receiver_id, listing_id, content);
      io.to(receiver_id).emit("message", { id, sender_id, receiver_id, listing_id, content, created_at: new Date().toISOString() });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
