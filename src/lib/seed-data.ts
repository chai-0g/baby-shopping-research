/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuid } from 'uuid';

interface SeedCategory {
  id: string;
  name: string;
  icon: string;
  items: {
    name: string;
    priority: 'must_have' | 'optional';
    status: 'pending' | 'researching' | 'reviewed' | 'purchased';
    notes: string;
    paperclipIssueId?: string;
  }[];
}

function getSeedData(): SeedCategory[] {
  return [
    {
      id: uuid(), name: 'Furniture/Big Items', icon: '🪑',
      items: [
        { name: 'Cot/Crib/Co-sleeper', priority: 'must_have', status: 'researching', notes: 'Options: Joie Roomie (0-6mo), Stokke (0-5y) mentioned', paperclipIssueId: 'JAK-21' },
        { name: 'Mattress', priority: 'must_have', status: 'pending', notes: 'Depends on cot dimensions' },
        { name: 'Sheets', priority: 'must_have', status: 'pending', notes: 'Depends on mattress size' },
        { name: 'Wardrobe', priority: 'must_have', status: 'pending', notes: 'Options: IKEA SMÅSTAD, Viator series. ~80cm width' },
        { name: 'Changing Station', priority: 'must_have', status: 'pending', notes: 'IKEA Älskvärd or reuse old one' },
        { name: 'Bottle Warmer', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Steriliser', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Stroller', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Washing Machine', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Food Maker (Steam/Blend)', priority: 'must_have', status: 'pending', notes: 'For later stage' },
      ]
    },
    {
      id: uuid(), name: 'Pre-natal', icon: '🤰',
      items: [
        { name: 'Momcozy Wedge Pillow', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Hospital Bag (+ Car Seat)', priority: 'must_have', status: 'pending', notes: 'Car seat: Mak has one' },
      ]
    },
    {
      id: uuid(), name: 'Clothing', icon: '👶',
      items: [
        { name: 'Bodysuits/Onesies', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Mittens', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Socks', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Sleepsuits', priority: 'must_have', status: 'pending', notes: 'Qty: 3' },
        { name: 'Hats', priority: 'optional', status: 'pending', notes: '' },
        { name: 'Dress-up Outfits', priority: 'optional', status: 'pending', notes: '' },
        { name: 'Shoes', priority: 'optional', status: 'pending', notes: '' },
      ]
    },
    {
      id: uuid(), name: 'Sleeping', icon: '😴',
      items: [
        { name: 'Sleepsack', priority: 'must_have', status: 'pending', notes: 'Qty: 1' },
        { name: 'Swaddle Blankets', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Cot Mobile', priority: 'optional', status: 'pending', notes: '' },
        { name: 'Waterproof Mattress Protector', priority: 'optional', status: 'pending', notes: '' },
      ]
    },
    {
      id: uuid(), name: 'Cleaning & Changing', icon: '🧼',
      items: [
        { name: 'Baby Wipes', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Diapers', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Baby Soap/Shampoo', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Baby Nail Clippers', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Diaper Cream', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Baby Oil/Lotion', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Towels', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Bath Seat/Baby Tub', priority: 'optional', status: 'pending', notes: '' },
        { name: 'Diaper Pail/Bin', priority: 'optional', status: 'pending', notes: '' },
      ]
    },
    {
      id: uuid(), name: 'Feeding', icon: '🍼',
      items: [
        { name: 'Feeding/Burp Cloths', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Bottles', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Milk Storage Containers', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Formula', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Manual/Electric Breast Pump', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Nursing Bra', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Breast Pads', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Nursing Pillow', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Bottle Drying Rack', priority: 'optional', status: 'pending', notes: '' },
      ]
    },
    {
      id: uuid(), name: 'Health & Safety', icon: '🏥',
      items: [
        { name: 'Thermometer', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Medicines', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Choke Device', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Snot Sucker', priority: 'optional', status: 'pending', notes: '' },
      ]
    },
    {
      id: uuid(), name: 'Playtime', icon: '🧸',
      items: [
        { name: 'Playmat', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Activity Gym', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Soft/Crinkle Books', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Baby Monitor', priority: 'optional', status: 'pending', notes: '' },
        { name: 'Bouncer/Rocker', priority: 'optional', status: 'pending', notes: '' },
        { name: 'Pacifier', priority: 'optional', status: 'pending', notes: '' },
      ]
    },
    {
      id: uuid(), name: 'Out & About', icon: '🚗',
      items: [
        { name: 'Baby Carrier', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Diaper Bag', priority: 'must_have', status: 'pending', notes: '' },
        { name: 'Changing Mat', priority: 'must_have', status: 'pending', notes: '' },
      ]
    },
  ];
}

// Takes a raw database object and seeds it. No dependency on getDb() to avoid circular imports.
export function runSeed(database: any): void {
  const seedData = getSeedData();
  const itemIdMap: Record<string, string> = {};

  seedData.forEach((cat, catIdx) => {
    database.run('INSERT INTO categories (id, name, icon, sortOrder) VALUES (?, ?, ?, ?)', [cat.id, cat.name, cat.icon, catIdx]);
    cat.items.forEach((item, itemIdx) => {
      const itemId = uuid();
      itemIdMap[item.name] = itemId;
      database.run('INSERT INTO items (id, categoryId, name, priority, status, notes, paperclipIssueId, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [itemId, cat.id, item.name, item.priority, item.status, item.notes, item.paperclipIssueId || null, itemIdx]);
    });
  });

  if (itemIdMap['Mattress'] && itemIdMap['Cot/Crib/Co-sleeper']) {
    database.run('INSERT INTO dependencies (id, itemId, dependsOnItemId, dependencyType, description, status) VALUES (?, ?, ?, ?, ?, ?)',
      [uuid(), itemIdMap['Mattress'], itemIdMap['Cot/Crib/Co-sleeper'], 'size_match', 'Mattress must match cot size exactly (European 120x60cm vs US 130x70cm)', 'unverified']);
  }
  if (itemIdMap['Sheets'] && itemIdMap['Mattress']) {
    database.run('INSERT INTO dependencies (id, itemId, dependsOnItemId, dependencyType, description, status) VALUES (?, ?, ?, ?, ?, ?)',
      [uuid(), itemIdMap['Sheets'], itemIdMap['Mattress'], 'size_match', 'Must fit mattress dimensions snugly for safety', 'unverified']);
  }
  if (itemIdMap['Changing Station'] && itemIdMap['Diaper Cream']) {
    database.run('INSERT INTO dependencies (id, itemId, dependsOnItemId, dependencyType, description, status) VALUES (?, ?, ?, ?, ?, ?)',
      [uuid(), itemIdMap['Changing Station'], itemIdMap['Diaper Cream'], 'complementary', 'Changing station needs diaper supplies nearby', 'unverified']);
  }
}
