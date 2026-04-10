import { NextRequest, NextResponse } from 'next/server';
import { getDb, execute, queryOne } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const db = await getDb();
  const fields: string[] = [];
  const values: unknown[] = [];
  for (const [key, val] of Object.entries(body)) {
    if (['name', 'brand', 'price', 'currency', 'retailer', 'productUrl', 'imageUrl', 'dimensions', 'safetyRating', 'rating', 'pros', 'cons', 'isTopPick', 'rank', 'attributes', 'itemId'].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(key === 'attributes' ? JSON.stringify(val) : key === 'isTopPick' ? (val ? 1 : 0) : val);
    }
  }
  if (fields.length === 0) return NextResponse.json({ error: 'No valid fields' }, { status: 400 });
  fields.push("updatedAt = datetime('now')");
  values.push(id);
  execute(db, `UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
  const product = queryOne(db, 'SELECT * FROM products WHERE id = ?', [id]);
  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  execute(db, 'DELETE FROM products WHERE id = ?', [id]);
  return NextResponse.json({ deleted: true });
}
