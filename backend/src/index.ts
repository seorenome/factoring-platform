import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let db: any;

const initDb = async () => {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  // Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('factor', 'supplier', 'debtor', 'admin')),
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Companies table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      edrpou TEXT UNIQUE NOT NULL,
      kycStatus TEXT DEFAULT 'pending',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Limits table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS limits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplierId INTEGER NOT NULL,
      supplierName TEXT NOT NULL,
      debtorId INTEGER NOT NULL,
      debtorName TEXT NOT NULL,
      limitAmount REAL NOT NULL,
      usedAmount REAL DEFAULT 0,
      availableAmount REAL NOT NULL,
      status TEXT DEFAULT 'active',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Requests table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requestNumber TEXT UNIQUE NOT NULL,
      supplierId INTEGER NOT NULL,
      supplierName TEXT NOT NULL,
      debtorId INTEGER NOT NULL,
      debtorName TEXT NOT NULL,
      debtorEdrpou TEXT NOT NULL,
      amount REAL NOT NULL,
      financingAmount REAL NOT NULL,
      factoringType TEXT DEFAULT 'classical',
      recourseType TEXT DEFAULT 'recourse',
      status TEXT DEFAULT 'pending',
      paymentDate TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Audit log table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      userName TEXT NOT NULL,
      userRole TEXT NOT NULL,
      action TEXT NOT NULL,
      entityType TEXT NOT NULL,
      entityId TEXT NOT NULL,
      entityName TEXT NOT NULL,
      details TEXT,
      ipAddress TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert demo users if empty
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await db.run(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      ['factor@finfactor.com', hashedPassword, 'Олена Петренко', 'factor']
    );
    await db.run(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      ['supplier@finfactor.com', hashedPassword, 'Іван Коваленко', 'supplier']
    );
    await db.run(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      ['debtor@finfactor.com', hashedPassword, 'Андрій Мельник', 'debtor']
    );
    await db.run(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      ['admin@finfactor.com', hashedPassword, 'Адміністратор', 'admin']
    );
  }

  // Insert demo companies if empty
  const companyCount = await db.get('SELECT COUNT(*) as count FROM companies');
  if (companyCount.count === 0) {
    await db.run(
      'INSERT INTO companies (name, edrpou, kycStatus) VALUES (?, ?, ?)',
      ['ТОВ "Постач-Пром"', '12345678', 'approved']
    );
    await db.run(
      'INSERT INTO companies (name, edrpou, kycStatus) VALUES (?, ?, ?)',
      ['ТОВ "Рітейл Груп"', '87654321', 'approved']
    );
    await db.run(
      'INSERT INTO companies (name, edrpou, kycStatus) VALUES (?, ?, ?)',
      ['ФОП Коваленко', '32165498', 'approved']
    );
    await db.run(
      'INSERT INTO companies (name, edrpou, kycStatus) VALUES (?, ?, ?)',
      ['ТОВ "Еко-Маркет"', '55555555', 'pending']
    );
  }

  // Insert demo limits if empty
  const limitCount = await db.get('SELECT COUNT(*) as count FROM limits');
  if (limitCount.count === 0) {
    await db.run(
      `INSERT INTO limits (supplierId, supplierName, debtorId, debtorName, limitAmount, usedAmount, availableAmount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [2, 'ТОВ "Постач-Пром"', 1, 'ТОВ "Рітейл Груп"', 1000000, 250000, 750000, 'active']
    );
    await db.run(
      `INSERT INTO limits (supplierId, supplierName, debtorId, debtorName, limitAmount, usedAmount, availableAmount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [3, 'ФОП Коваленко', 4, 'ТОВ "Еко-Маркет"', 500000, 120000, 380000, 'active']
    );
  }

  // Insert demo requests if empty
  const requestCount = await db.get('SELECT COUNT(*) as count FROM requests');
  if (requestCount.count === 0) {
    await db.run(
      `INSERT INTO requests (requestNumber, supplierId, supplierName, debtorId, debtorName, debtorEdrpou, amount, financingAmount, factoringType, recourseType, status, paymentDate, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['REQ-001', 2, 'ТОВ "Постач-Пром"', 1, 'ТОВ "Рітейл Груп"', '87654321', 250000, 200000, 'classical', 'recourse', 'pending', '2026-07-25', new Date().toISOString()]
    );
    await db.run(
      `INSERT INTO requests (requestNumber, supplierId, supplierName, debtorId, debtorName, debtorEdrpou, amount, financingAmount, factoringType, recourseType, status, paymentDate, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['REQ-002', 3, 'ФОП Коваленко', 4, 'ТОВ "Еко-Маркет"', '55555555', 120000, 96000, 'classical', 'recourse', 'approved', '2026-08-15', new Date().toISOString()]
    );
    await db.run(
      `INSERT INTO requests (requestNumber, supplierId, supplierName, debtorId, debtorName, debtorEdrpou, amount, financingAmount, factoringType, recourseType, status, paymentDate, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['REQ-003', 2, 'ТОВ "Постач-Пром"', 1, 'ТОВ "Рітейл Груп"', '87654321', 180000, 144000, 'reverse', 'non-recourse', 'pending', '2026-09-10', new Date().toISOString()]
    );
  }

  // Insert demo audit log if empty
  const auditCount = await db.get('SELECT COUNT(*) as count FROM audit_log');
  if (auditCount.count === 0) {
    await db.run(
      `INSERT INTO audit_log (userId, userName, userRole, action, entityType, entityId, entityName, details, ipAddress, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [1, 'Олена Петренко', 'factor', 'APPROVE', 'request', 'REQ-002', 'Заявка REQ-002', 'Схвалено фінансування', '192.168.1.1', new Date().toISOString()]
    );
    await db.run(
      `INSERT INTO audit_log (userId, userName, userRole, action, entityType, entityId, entityName, details, ipAddress, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [2, 'Іван Коваленко', 'supplier', 'CREATE', 'request', 'REQ-001', 'Заявка REQ-001', 'Створено нову заявку', '192.168.1.2', new Date().toISOString()]
    );
    await db.run(
      `INSERT INTO audit_log (userId, userName, userRole, action, entityType, entityId, entityName, details, ipAddress, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [1, 'Олена Петренко', 'factor', 'LOGIN', 'auth', '1', 'Вхід в систему', 'Успішний вхід', '192.168.1.1', new Date().toISOString()]
    );
  }

  console.log('Database initialized with demo data');
};

// Routes
app.get('/api/requests', async (req, res) => {
  const requests = await db.all('SELECT * FROM requests ORDER BY createdAt DESC');
  res.json(requests);
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');

  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET || 'secret-key',
    { expiresIn: '24h' }
  );

  // Log to audit
  await db.run(
    `INSERT INTO audit_log (userId, userName, userRole, action, entityType, entityId, entityName, details, ipAddress)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user.id, user.name, user.role, 'LOGIN', 'auth', String(user.id), 'Вхід в систему', 'Успішний вхід', req.ip || 'unknown']
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

app.get('/api/limits', async (req, res) => {
  const limits = await db.all('SELECT * FROM limits');
  res.json(limits);
});

app.get('/api/companies', async (req, res) => {
  const companies = await db.all('SELECT * FROM companies');
  res.json(companies);
});

app.get('/api/audit', async (req, res) => {
  const audit = await db.all('SELECT * FROM audit_log ORDER BY createdAt DESC LIMIT 100');
  res.json(audit);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

initDb().catch(console.error);