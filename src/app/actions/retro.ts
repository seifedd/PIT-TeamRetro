"use server";
import { prisma } from '@/lib/prisma';

export async function getRetroBoard(id: string) {
  return await prisma.retroBoard.findUnique({
    where: { id },
    include: { items: true, actions: true }
  });
}

export async function addRetroItem(boardId: string, author: string, text: string, category: string) {
  return await prisma.retroItem.create({
    data: { boardId, author, text, category }
  });
}

export async function updateBoardStatus(boardId: string, status: string) {
  return await prisma.retroBoard.update({
    where: { id: boardId },
    data: { status }
  });
}
