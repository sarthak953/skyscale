import prisma from './prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function getOrCreateUser() {
  const { userId } = await auth();
  
  console.log('Clerk userId from auth():', userId);
  
  if (!userId) {
    console.log('No userId found, returning null');
    return null;
  }

  try {
    let user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      const clerkUser = await currentUser();
      const email = clerkUser?.primaryEmailAddress?.emailAddress || '';
      console.log('Creating new user with Clerk data:', clerkUser);
      
      // Check if email already exists
      const existingUser = await prisma.users.findUnique({
        where: { email }
      });

      if (existingUser) {
        console.log('User with this email already exists:', existingUser.id);
        return existingUser;
      }

      user = await prisma.users.create({
        data: {
          id: userId,
          email,
          password_hash: 'clerk_auth',
          first_name: clerkUser?.firstName || null,
          last_name: clerkUser?.lastName || null,
          role: 'customer'
        }
      });
      console.log('Created user:', user);
    } else {
      console.log('Found existing user:', user);
    }

    return user;
  } catch (error) {
    console.error('User creation/lookup failed:', error);
    return null;
  }
}