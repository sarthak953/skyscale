import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const category = await prisma.categories.create({
      data: {
        ...data,
        is_active: true,
        sort_order: 0
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/categories error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { sort_order: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('GET /api/admin/categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    await prisma.categories.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/categories error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
