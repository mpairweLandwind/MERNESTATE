import { PrismaClient } from '@prisma/client';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const prisma = new PrismaClient();


const testFullFlow = async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTQ1NzQ0YjJhZjdmMzA2NmE4MzM1MyIsImlhdCI6MTcxODI1NDAyMCwiZXhwIjoxNzE4MjU3NjIwfQ.v_iH5itj_DZLNxd2BNIzZZKQ21DpJP75WqWSiA0C1JM'; // Generate this token with a tool or a script
    
    // Simulate middleware
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        console.log('Token verification failed:', err);
        return;
      }
      
      const tokenUserId = user.id;
      console.log(`Extracted Token User ID in Test Script: ${tokenUserId}`);
  
      if (!ObjectId.isValid(tokenUserId)) {
        console.error("Invalid user ID format");
        return;
      }
  
      const number = await prisma.chat.count({
        where: {
          userRefs: {
            hasSome: [tokenUserId],
          },
          NOT: {
            seenBy: {
              hasSome: [tokenUserId],
            },
          },
        },
      });
  
      console.log('Query successful, count:', number);
    });
  };
  
  testFullFlow();
  