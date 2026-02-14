import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import config from '../../config';
import prisma from '../utils/prisma';

const seedSuperAdmin = async () => {
  try {
    const email = "admin@gmail.com";
    // 1. Check existence first to avoid unnecessary hashing
    const existingAdmin = await prisma.user.findFirst({ 
      where: { role : Role.ADMIN } 
    });
    if (existingAdmin) {
      console.log('ℹSuper Admin already exists. Skipping...');
      return;
    }
    // 2. Hash password only if needed
    const hashedPassword = await bcrypt.hash(
      String(config.super_admin_password || "123456"),
      Number(config.bcrypt_salt_rounds) || 12
    );

    // 3. Create Admin
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    console.log('Super Admin created successfully.');
  } catch (error) {
    console.error('❌ Seed Error:', error);
  }
};

export default seedSuperAdmin;