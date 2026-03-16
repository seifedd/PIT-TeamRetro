import { prisma } from '@/lib/prisma';
import ClientRetroBoard from '@/components/ClientRetroBoard';
import { notFound } from 'next/navigation';

export default async function RetroBoardPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const board = await prisma.retroBoard.findUnique({
    where: { id },
    include: { items: true, actions: true }
  });

  if (!board) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 flex flex-col">
      {/* ─── Header ─── */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-200 group-hover:shadow-md group-hover:shadow-indigo-200 transition">
              <span className="text-white font-bold text-xs">TR</span>
            </div>
          </a>
          <div className="h-5 w-px bg-slate-200"></div>
          <div>
            <h1 className="text-lg font-[Outfit] font-bold tracking-tight text-slate-900 leading-tight">{board.title}</h1>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">ID: {board.id}</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide">
            {board.status.replace(/_/g, " ")}
          </span>
        </div>
      </header>

      {/* ─── Board Content ─── */}
      <main className="flex-1 p-6">
        <ClientRetroBoard initialBoard={board} />
      </main>
    </div>
  );
}
