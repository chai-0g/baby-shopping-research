import { NextRequest, NextResponse } from 'next/server';
import { getDb, execute, queryOne } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const db = await getDb();
  const fields: string[] = [];
  const values: unknown[] = [];
  for (const [key, val] of Object.entries(body)) {
    if (['name', 'icon', 'sortOrder'].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(val);
    }
  }
  if (fields.length === 0) return NextResponse.json({ error: 'No valid fields' }, { status: 400 });
  fields.push("updatedAt = datetime('now')");
  values.push(id);
  execute(db, `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
  const cat = queryOne(db, 'SELECT * FROM categories WHERE id = ?', [id]);
  return NextResponse.json(cat);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  execute(db, 'DELETE FROM categories WHERE id = ?', [id]);
  return NextResponse.json({ deleted: true });
}
