import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../mindcare.db');

let db: SqlJsDatabase | null = null;
let SQL: Awaited<ReturnType<typeof initSqlJs>> | null = null;

export function saveDb(): void {
  if (db) {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
}

export async function initDatabase(): Promise<void> {
  SQL = await initSqlJs();
  
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      description TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS keywords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      keyword TEXT NOT NULL,
      weight INTEGER DEFAULT 1,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      sub_topic TEXT,
      response_text TEXT NOT NULL,
      requires_followup INTEGER DEFAULT 0,
      followup_prompt TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      session_id TEXT PRIMARY KEY,
      current_flow TEXT,
      flow_step INTEGER DEFAULT 0,
      context_data TEXT,
      current_mood TEXT,
      last_activity TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS mood_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      mood TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES sessions(session_id)
    );
  `);

  saveDb();
  console.log('Database initialized successfully');
}

export function getDb(): SqlJsDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

// Helper: run a query with parameters and auto-save
export function dbRun(sql: string, params: (string | number | null)[] = []): void {
  getDb().run(sql, params);
  saveDb();
}

// Helper: get all rows
export function dbAll<T>(sql: string, params: (string | number | null)[] = []): T[] {
  const stmt = getDb().prepare(sql);
  stmt.bind(params);
  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return rows;
}

// Helper: get single row
export function dbGet<T>(sql: string, params: (string | number | null)[] = []): T | null {
  const rows = dbAll<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

// Helper: insert and return last insert rowid
export function dbInsert(sql: string, params: (string | number | null)[] = []): number {
  getDb().run(sql, params);
  const result = dbGet<{ id: number }>('SELECT last_insert_rowid() as id');
  saveDb();
  return result?.id ?? 0;
}
