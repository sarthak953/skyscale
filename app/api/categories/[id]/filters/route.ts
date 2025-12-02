import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const filters = await prisma.products.findMany({
      where: {
        category_id: id,
        filter_type: { not: null },
        status: 'published'
      },
      select: { filter_type: true },
      distinct: ['filter_type']
    });

    const uniqueFilters = filters.map(f => f.filter_type).filter(Boolean);
    return NextResponse.json(uniqueFilters);
  } catch (error) {
    console.error('GET filters error:', error);
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 });
  }
}
