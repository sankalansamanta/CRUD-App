import bcrypt from 'bcryptjs';
import { getDb } from '../database/init.js';

export const findUserByEmail = (email) => {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  db.close();
  return user;
};

export const findUserById = (id) => {
  const db = getDb();
  const user = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(id);
  db.close();
  return user;
};

export const createUser = (username, email, password) => {
  const db = getDb();
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  try {
    const result = db.prepare(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
    ).run(username, email, hashedPassword);
    
    const user = findUserById(result.lastInsertRowid);
    db.close();
    return user;
  } catch (error) {
    db.close();
    throw error;
  }
};

export const validatePassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};