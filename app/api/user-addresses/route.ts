import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/userService';

export async function GET(req: Request) {
  try {
    const user = await getOrCreateUser();
    
    if (!user) {
      return NextResponse.json({ addresses: [] });
    }

    const dbUser = await prisma.users.findUnique({
      where: { id: user.id },
      include: {
        user_addresses: {
          orderBy: { created_at: 'desc' }
        }
      }
    });

    return NextResponse.json({ addresses: dbUser?.user_addresses || [] });
  } catch (error) {
    console.error('GET user addresses error:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, address, isDefault } = await req.json();
    
    const user = await getOrCreateUser();
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    if (isDefault) {
      await prisma.user_addresses.updateMany({
        where: { user_id: user.id },
        data: { is_default: false }
      });
    }

    const savedAddress = await prisma.user_addresses.create({
      data: {
        user_id: user.id,
        recipient_name: address.name,
        street_line1: address.street_line1,
        street_line2: address.street_line2,
        city: address.city,
        state: address.state,
        postal_code: address.pincode,
        country: address.country,
        is_default: isDefault || false
      }
    });

    return NextResponse.json({ address: savedAddress });
  } catch (error) {
    console.error('POST user address error:', error);
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, address, isDefault } = await req.json();
    
    const user = await getOrCreateUser();
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    if (isDefault) {
      await prisma.user_addresses.updateMany({
        where: { user_id: user.id },
        data: { is_default: false }
      });
    }

    const updatedAddress = await prisma.user_addresses.update({
      where: { id, user_id: user.id },
      data: {
        recipient_name: address.name,
        street_line1: address.street_line1,
        street_line2: address.street_line2,
        city: address.city,
        state: address.state,
        postal_code: address.pincode,
        country: address.country,
        is_default: isDefault || false
      }
    });

    return NextResponse.json({ address: updatedAddress });
  } catch (error) {
    console.error('PUT user address error:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 });
    }

    const user = await getOrCreateUser();
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    await prisma.user_addresses.delete({
      where: { id, user_id: user.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE user address error:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
