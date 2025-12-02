import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const categories = [
  { name: 'Aircraft', slug: 'aircraft', image_url: '/images/categories/aircraft.jpg' },
  { name: 'Armor and Military vehicles', slug: 'armor', image_url: '/images/categories/armor.jpg' },
  { name: 'Cars and Motorcycles', slug: 'cars', image_url: '/images/categories/cars.jpg' },
  { name: 'Trucks/Commercial/Constructions', slug: 'trucks', image_url: '/images/categories/trucks.jpg' },
  { name: 'Ships and Boats', slug: 'ships', image_url: '/images/categories/ships.jpg' },
  { name: 'Trains and Railways', slug: 'trains', image_url: '/images/categories/trains.jpg' },
  { name: 'Space', slug: 'space', image_url: '/images/categories/space.jpg' },
  { name: 'ScienceFriction', slug: 'scifi', image_url: '/images/categories/scifi.jpg' },
  { name: 'Figures', slug: 'figures', image_url: '/images/categories/figures.jpg' },
  { name: 'Dioramas and Bases', slug: 'dioramas', image_url: '/images/categories/dioramas.jpg' },
  { name: 'Cross category essentials', slug: 'essentials', image_url: '/images/categories/essentials.jpg' },
  { name: 'Dynamic models(RC)', slug: 'dynamic', image_url: '/images/categories/dynamic.jpg' }
];

export async function POST() {
  try {
    // Check if categories already exist
    const existingCount = await prisma.categories.count();
    if (existingCount > 0) {
      return NextResponse.json({ message: 'Categories already exist' });
    }

    // Create categories
    const createdCategories = await Promise.all(
      categories.map((cat, index) =>
        prisma.categories.create({
          data: {
            ...cat,
            sort_order: index,
            is_active: true
          }
        })
      )
    );

    return NextResponse.json({ 
      message: 'Categories seeded successfully', 
      count: createdCategories.length 
    });
  } catch (error) {
    console.error('Seed categories error:', error);
    return NextResponse.json({ error: 'Failed to seed categories' }, { status: 500 });
  }
}