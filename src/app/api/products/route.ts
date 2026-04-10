import { NextRequest, NextResponse } from 'next/server';
import { getDb, queryAll, execute, queryOne } from '@/lib/db';
import { v4 as uuid } from 'uuid';

export async function GET(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get('itemId');

  let sql = 'SELECT p.*, i.name as itemName FROM products p JOIN items i ON p.itemId = i.id';
  const params: unknown[] = [];
  if (itemId) { sql += ' WHERE p.itemId = ?'; params.push(itemId); }
  sql += ' ORDER BY p.rank, p.createdAt';

  const products = queryAll(db, sql, params);
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = await getDb();
  const id = uuid();
  execute(db, `
    INSERT INTO products (id, itemId, name, brand, price, currency, retailer, productUrl, imageUrl, dimensions, safetyRating, rating, pros, cons, isTopPick, rank, attributes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, body.itemId, body.name, body.brand || '', body.price || null, body.currency || 'SGD', body.retailer || '', body.productUrl || '', body.imageUrl || '', body.dimensions || '', body.safetyRating || '', body.rating || null, body.pros || '', body.cons || '', body.isTopPick ? 1 : 0, body.rank || 0, JSON.stringify(body.attributes || {})]);
  const product = queryOne(db, 'SELECT * FROM products WHERE id = ?', [id]);
  return NextResponse.json(product, { status: 201 });
}
