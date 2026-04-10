"use server";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getRetroBoard(id: string) {
  return await prisma.retroBoard.findUnique({
    where: { id },
    include: { items: true, actions: true }
  });
}

export async function addRetroItem(boardId: string, author: string, text: string, category: string) {
  const item = await prisma.retroItem.create({
    data: { boardId, author, text, category }
  });
  revalidatePath(`/retro/${boardId}`);
  return item;
}

export async function voteRetroItem(itemId: string, boardId: string) {
  const item = await prisma.retroItem.update({
    where: { id: itemId },
    data: { votes: { increment: 1 } }
  });
  revalidatePath(`/retro/${boardId}`);
  return item;
}

export async function updateBoardStatus(boardId: string, status: string) {
  const board = await prisma.retroBoard.update({
    where: { id: boardId },
    data: { status }
  });
  revalidatePath(`/retro/${boardId}`);
  return board;
}
