import { NextRequest, NextResponse } from 'next/server';
import { getDb, execute, queryOne } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const item = queryOne(db, `
    SELECT i.*, c.name as categoryName, c.icon as categoryIcon
    FROM items i JOIN categories c ON i.categoryId = c.id WHERE i.id = ?
  `, [id]);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const db = await getDb();
  const fields: string[] = [];
  const values: unknown[] = [];
  for (const [key, val] of Object.entries(body)) {
    if (['name', 'categoryId', 'priority', 'status', 'notes', 'budgetEstimate', 'actualCost', 'paperclipIssueId', 'sortOrder'].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(val);
    }
  }
  if (fields.length === 0) return NextResponse.json({ error: 'No valid fields' }, { status: 400 });
  fields.push("updatedAt = datetime('now')");
  values.push(id);
  execute(db, `UPDATE items SET ${fields.join(', ')} WHERE id = ?`, values);
  const item = queryOne(db, 'SELECT i.*, c.name as categoryName, c.icon as categoryIcon FROM items i JOIN categories c ON i.categoryId = c.id WHERE i.id = ?', [id]);
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  execute(db, 'DELETE FROM items WHERE id = ?', [id]);
  return NextResponse.json({ deleted: true });
}
