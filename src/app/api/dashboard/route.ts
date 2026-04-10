import { NextResponse } from 'next/server';
import { getDb, queryAll, queryOne } from '@/lib/db';

export async function GET() {
  const db = await getDb();

  const totalItems = queryOne(db, 'SELECT COUNT(*) as count FROM items') as { count: number };
  const byStatus = queryAll(db, 'SELECT status, COUNT(*) as count FROM items GROUP BY status') as { status: string; count: number }[];
  const byPriority = queryAll(db, 'SELECT priority, COUNT(*) as count FROM items GROUP BY priority') as { priority: string; count: number }[];
  const budgetSummary = queryOne(db, `
    SELECT
      COALESCE(SUM(budgetEstimate), 0) as totalEstimated,
      COALESCE(SUM(actualCost), 0) as totalSpent,
      COALESCE(SUM(CASE WHEN priority = 'must_have' THEN budgetEstimate ELSE 0 END), 0) as mustHaveEstimated,
      COALESCE(SUM(CASE WHEN priority = 'optional' THEN budgetEstimate ELSE 0 END), 0) as optionalEstimated
    FROM items
  `);
  const categoryProgress = queryAll(db, `
    SELECT c.id, c.name, c.icon,
      COUNT(i.id) as totalItems,
      SUM(CASE WHEN i.status = 'purchased' THEN 1 ELSE 0 END) as purchased,
      SUM(CASE WHEN i.status = 'reviewed' THEN 1 ELSE 0 END) as reviewed,
      SUM(CASE WHEN i.status = 'researching' THEN 1 ELSE 0 END) as researching,
      SUM(CASE WHEN i.status = 'pending' THEN 1 ELSE 0 END) as pending,
      COALESCE(SUM(i.budgetEstimate), 0) as budgetEstimate,
      COALESCE(SUM(i.actualCost), 0) as actualCost
    FROM categories c LEFT JOIN items i ON c.id = i.categoryId
    GROUP BY c.id ORDER BY c.sortOrder
  `);
  const recentItems = queryAll(db, `
    SELECT i.*, c.name as categoryName, c.icon as categoryIcon
    FROM items i JOIN categories c ON i.categoryId = c.id
    WHERE i.status != 'pending'
    ORDER BY i.updatedAt DESC LIMIT 10
  `);

  return NextResponse.json({
    totalItems: totalItems.count,
    byStatus: Object.fromEntries(byStatus.map(s => [s.status, s.count])),
    byPriority: Object.fromEntries(byPriority.map(p => [p.priority, p.count])),
    budgetSummary,
    categoryProgress,
    recentItems,
  });
}
