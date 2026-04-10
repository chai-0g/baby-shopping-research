import { NextRequest, NextResponse } from 'next/server';
import { getDb, queryAll, execute, queryOne } from '@/lib/db';
import { v4 as uuid } from 'uuid';

export async function GET() {
  const db = await getDb();
  const categories = queryAll(db, `
    SELECT c.*,
      (SELECT COUNT(*) FROM items WHERE categoryId = c.id) as itemCount,
      (SELECT COUNT(*) FROM items WHERE categoryId = c.id AND status = 'purchased') as purchasedCount,
      (SELECT COUNT(*) FROM items WHERE categoryId = c.id AND status = 'reviewed') as reviewedCount,
      (SELECT COUNT(*) FROM items WHERE categoryId = c.id AND status = 'researching') as researchingCount,
      (SELECT COALESCE(SUM(budgetEstimate), 0) FROM items WHERE categoryId = c.id) as totalBudget,
      (SELECT COALESCE(SUM(actualCost), 0) FROM items WHERE categoryId = c.id) as totalSpent
    FROM categories c ORDER BY c.sortOrder
  `);
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = await getDb();
  const id = uuid();
  const maxOrder = queryOne(db, 'SELECT COALESCE(MAX(sortOrder), -1) + 1 as next FROM categories') as { next: number };
  execute(db, 'INSERT INTO categories (id, name, icon, sortOrder) VALUES (?, ?, ?, ?)', [id, body.name, body.icon || '📦', maxOrder.next]);
  const cat = queryOne(db, 'SELECT * FROM categories WHERE id = ?', [id]);
  return NextResponse.json(cat, { status: 201 });
}
