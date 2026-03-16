"use server";
import { prisma } from '@/lib/prisma';

export async function getHealthBoard(id: string) {
  return await prisma.healthCheckBoard.findUnique({
    where: { id },
    include: { metrics: true }
  });
}

export async function addHealthMetric(boardId: string, author: string, dimension: string, rating: string) {
  // Try to find if user already voted for this dimension
  const existing = await prisma.healthCheckMetric.findFirst({
    where: { boardId, author, dimension }
  });

  if (existing) {
    return await prisma.healthCheckMetric.update({
      where: { id: existing.id },
      data: { rating }
    });
  }

  return await prisma.healthCheckMetric.create({
    data: { boardId, author, dimension, rating }
  });
}
