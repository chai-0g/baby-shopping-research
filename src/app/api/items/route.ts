import { NextRequest, NextResponse } from 'next/server';
import { getDb, queryAll, execute, queryOne } from '@/lib/db';
import { v4 as uuid } from 'uuid';

export async function GET(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get('categoryId');
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const search = searchParams.get('q');

  let sql = `
    SELECT i.*, c.name as categoryName, c.icon as categoryIcon,
      (SELECT COUNT(*) FROM products WHERE itemId = i.id) as productCount,
      (SELECT COUNT(*) FROM products WHERE itemId = i.id AND isTopPick = 1) as topPickCount
    FROM items i
    JOIN categories c ON i.categoryId = c.id
    WHERE 1=1
  `;
  const params: unknown[] = [];

  if (categoryId) { sql += ' AND i.categoryId = ?'; params.push(categoryId); }
  if (status) { sql += ' AND i.status = ?'; params.push(status); }
  if (priority) { sql += ' AND i.priority = ?'; params.push(priority); }
  if (search) { sql += ' AND i.name LIKE ?'; params.push(`%${search}%`); }

  sql += ' ORDER BY c.sortOrder, i.sortOrder';
  const items = queryAll(db, sql, params);
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = await getDb();
  const id = uuid();
  const maxOrder = queryOne(db, 'SELECT COALESCE(MAX(sortOrder), -1) + 1 as next FROM items WHERE categoryId = ?', [body.categoryId]) as { next: number };
  execute(db, `
    INSERT INTO items (id, categoryId, name, priority, status, notes, budgetEstimate, actualCost, paperclipIssueId, sortOrder)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, body.categoryId, body.name, body.priority || 'must_have', body.status || 'pending', body.notes || '', body.budgetEstimate || null, body.actualCost || null, body.paperclipIssueId || null, maxOrder.next]);
  const item = queryOne(db, 'SELECT i.*, c.name as categoryName, c.icon as categoryIcon FROM items i JOIN categories c ON i.categoryId = c.id WHERE i.id = ?', [id]);
  return NextResponse.json(item, { status: 201 });
}
