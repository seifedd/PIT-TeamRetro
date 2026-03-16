"use server";

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createRetroBoard(formData: FormData) {
  const title = formData.get('title') as string;
  if (!title) return;

  const board = await prisma.retroBoard.create({
    data: { title },
  });

  redirect(`/retro/${board.id}`);
}

export async function createHealthCheckBoard(formData: FormData) {
  const title = formData.get('title') as string;
  if (!title) return;

  const board = await prisma.healthCheckBoard.create({
    data: { title },
  });

  redirect(`/health/${board.id}`);
}

export async function joinBoard(formData: FormData) {
  const joinCode = formData.get('joinCode') as string;
  const boardType = formData.get('boardType') as string; // 'retro' or 'health'
  
  if (!joinCode || !boardType) return;
  redirect(`/${boardType}/${joinCode}`);
}
