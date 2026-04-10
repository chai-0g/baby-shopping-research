/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
const initSqlJs = require('sql.js/dist/sql-asm.js');
import { runSeed } from './seed-data';

type SqlJsDatabase = {
  run(sql: string, params?: any[]): void;
  exec(sql: string): { columns: string[]; values: unknown[][] }[];
  prepare(sql: string): {
    bind(params?: any[]): boolean;
    step(): boolean;
    getAsObject(): Record<string, any>;
    free(): boolean;
    reset(): void;
  };
  close(): void;
};

let db: SqlJsDatabase | null = null;
let dbReady: Promise<SqlJsDatabase> | null = null;

function initSchema(database: SqlJsDatabase) {
  database.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT '📦',
      sortOrder INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  database.run(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      categoryId TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'must_have' CHECK(priority IN ('must_have', 'optional')),
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'researching', 'reviewed', 'purchased')),
      notes TEXT DEFAULT '',
      budgetEstimate REAL,
      actualCost REAL,
      paperclipIssueId TEXT,
      sortOrder INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  database.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      itemId TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      brand TEXT DEFAULT '',
      price REAL,
      currency TEXT NOT NULL DEFAULT 'SGD',
      retailer TEXT DEFAULT '',
      productUrl TEXT DEFAULT '',
      imageUrl TEXT DEFAULT '',
      dimensions TEXT DEFAULT '',
      safetyRating TEXT DEFAULT '',
      rating REAL,
      pros TEXT DEFAULT '',
      cons TEXT DEFAULT '',
      isTopPick INTEGER NOT NULL DEFAULT 0,
      rank INTEGER DEFAULT 0,
      attributes TEXT DEFAULT '{}',
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  database.run(`
    CREATE TABLE IF NOT EXISTS dependencies (
      id TEXT PRIMARY KEY,
      itemId TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
      dependsOnItemId TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
      dependencyType TEXT NOT NULL DEFAULT 'compatibility' CHECK(dependencyType IN ('size_match', 'compatibility', 'complementary')),
      description TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'unverified' CHECK(status IN ('unverified', 'compatible', 'incompatible')),
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

async function initDb(): Promise<SqlJsDatabase> {
  const SQL = await initSqlJs();
  const database = new SQL.Database();
  initSchema(database);
  runSeed(database);
  return database;
}

export async function getDb(): Promise<SqlJsDatabase> {
  if (db) return db;
  if (!dbReady) {
    dbReady = initDb().then(database => {
      db = database;
      return database;
    });
  }
  return dbReady;
}

export function queryAll(database: SqlJsDatabase, sql: string, params: any[] = []): Record<string, any>[] {
  const stmt = database.prepare(sql);
  stmt.bind(params);
  const results: Record<string, any>[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

export function queryOne(database: SqlJsDatabase, sql: string, params: any[] = []): Record<string, any> | undefined {
  const rows = queryAll(database, sql, params);
  return rows[0];
}

export function execute(database: SqlJsDatabase, sql: string, params: any[] = []): void {
  database.run(sql, params);
}
