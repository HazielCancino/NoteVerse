import { contextBridge } from 'electron';
import Database from 'better-sqlite3';
import fs from 'fs';

// Load DB
const db = new Database('./db/notes.db');

// Set up tables if needed
const schema = fs.readFileSync('./db/schema.sql', 'utf8');
db.exec(schema);

// Expose APIs to frontend
contextBridge.exposeInMainWorld('notesAPI', {
  getNotes: () => {
    const stmt = db.prepare('SELECT * FROM notes ORDER BY created_at DESC');
    return stmt.all();
  },
  addNote: (title, content) => {
    const stmt = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
    const info = stmt.run(title, content);
    return info.lastInsertRowid;
  }
});
