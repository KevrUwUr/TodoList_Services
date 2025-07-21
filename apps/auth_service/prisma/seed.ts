import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default role if it doesn't exist
  const existingRole = await prisma.role.findFirst({
    where: { name: 'user' }
  });

  if (!existingRole) {
    const defaultRole = await prisma.role.create({
      data: {
        name: 'user',
        description: 'Default user role',
        permissions: JSON.stringify([
          'read:profile',
          'update:profile',
          'create:project',
          'create:task'
        ])
      }
    });
    console.log('Default user role created:', defaultRole);
  } else {
    console.log('Default user role already exists');
  }

  // Create admin role if it doesn't exist
  const existingAdminRole = await prisma.role.findFirst({
    where: { name: 'admin' }
  });

  if (!existingAdminRole) {
    const adminRole = await prisma.role.create({
      data: {
        name: 'admin',
        description: 'Administrator role',
        permissions: JSON.stringify([
          'read:*',
          'write:*',
          'delete:*',
          'manage:users'
        ])
      }
    });
    console.log('Admin role created:', adminRole);
  } else {
    console.log('Admin role already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
