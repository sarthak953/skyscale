import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { name, email, phone, quantity, scale, description, files } = await req.json();

    // Validation
    if (!name || !email || !phone || !description) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
    }

    const qty = typeof quantity === 'number' ? quantity : parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json({ error: 'Quantity must be a valid number greater than 0' }, { status: 400 });
    }

    // Get user ID if authenticated
    let user_id: string | null = null;
    try {
      const { userId } = await auth();
      if (userId) {
        const dbUser = await prisma.users.findUnique({ where: { id: userId } });
        if (!dbUser) {
          const clerkUser = await currentUser();
          if (clerkUser?.emailAddresses?.[0]?.emailAddress) {
            await prisma.users.create({
              data: {
                id: userId,
                email: clerkUser.emailAddresses[0].emailAddress,
                password_hash: 'clerk_auth',
                first_name: clerkUser.firstName || null,
                last_name: clerkUser.lastName || null,
                role: 'customer',
              },
            });
          }
        }
        user_id = userId;
      }
    } catch (authError) {
      console.log('Auth check failed, continuing as guest:', authError);
    }

    // Create preorder record
    const preorder = await prisma.preorder_enquiries.create({
      data: {
        user_id,
        name,
        email,
        phone,
        quantity: qty,
        scale: scale || null,
        description,
        status: 'new',
      },
    });

    // Attach uploaded files
    if (files && files.length > 0) {
      const fileRecords = files.map((file: any) => ({
        preorder_id: preorder.id,
        file_url: file.url,
        file_name: file.name || null,
        file_type: file.type || null,
        file_size_bytes: file.size || null,
        source: 'upload' as const,
      }));

      await prisma.preorder_files.createMany({ data: fileRecords });
    }

    return NextResponse.json({
      message: 'Preorder enquiry submitted successfully',
      preorderId: preorder.id,
    });
  } catch (error) {
    console.error('❌ Preorder submission error:', error);
    return NextResponse.json({ error: 'Failed to submit preorder enquiry' }, { status: 500 });
  }
}
