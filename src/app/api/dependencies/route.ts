import { NextRequest, NextResponse } from 'next/server';
import { getDb, queryAll, execute, queryOne } from '@/lib/db';
import { v4 as uuid } from 'uuid';

export async function GET() {
  const db = await getDb();
  const deps = queryAll(db, `
    SELECT d.*,
      i1.name as itemName, i1.status as itemStatus,
      i2.name as dependsOnName, i2.status as dependsOnStatus
    FROM dependencies d
    JOIN items i1 ON d.itemId = i1.id
    JOIN items i2 ON d.dependsOnItemId = i2.id
    ORDER BY d.createdAt
  `);
  return NextResponse.json(deps);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = await getDb();
  const id = uuid();
  execute(db, `
    INSERT INTO dependencies (id, itemId, dependsOnItemId, dependencyType, description, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [id, body.itemId, body.dependsOnItemId, body.dependencyType || 'compatibility', body.description || '', body.status || 'unverified']);
  const dep = queryOne(db, `
    SELECT d.*, i1.name as itemName, i2.name as dependsOnName
    FROM dependencies d JOIN items i1 ON d.itemId = i1.id JOIN items i2 ON d.dependsOnItemId = i2.id
    WHERE d.id = ?
  `, [id]);
  return NextResponse.json(dep, { status: 201 });
}
