import { createRetroBoard, createHealthCheckBoard, joinBoard } from "./actions/board";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex flex-col">
      
      {/* ─── Navigation Bar ─── */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-white/60 backdrop-blur-lg sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
            <span className="text-white font-bold text-sm">TR</span>
          </div>
          <span className="font-[Outfit] text-lg font-bold tracking-tight text-slate-900">TeamRetro <span className="text-indigo-500 text-xs font-medium ml-1 bg-indigo-50 px-2 py-0.5 rounded-full">Local</span></span>
        </div>
        <a href="https://github.com" target="_blank" className="text-slate-400 hover:text-slate-600 transition text-sm font-medium">v0.1.0</a>
      </nav>

      {/* ─── Hero ─── */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-5xl mx-auto w-full">
        <div className="text-center space-y-5 mb-14 animate-fade-in-up">
          <div className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-2">
            100% Free &amp; Local — No SaaS Required
          </div>
          <h1 className="text-5xl md:text-6xl font-[Outfit] font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Retrospectives &amp; Health Checks
            <span className="gradient-text block mt-1">Made Simple.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Run engaging agile retros, track team sentiment with health checks, and drive actionable outcomes — all from your local machine.
          </p>
        </div>

        {/* ─── Action Cards ─── */}
        <div className="grid md:grid-cols-2 gap-6 w-full animate-fade-in-up delay-200">
          
          {/* Create Session Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden card-hover">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4">
              <h2 className="text-white font-[Outfit] text-xl font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Create Session
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <form action={createRetroBoard}>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">New Retrospective</label>
                <div className="flex gap-2">
                  <input required name="title" type="text" placeholder="e.g. Sprint 42 Retro" className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition placeholder:text-slate-300" />
                  <button type="submit" className="btn-primary bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 hover:shadow-md hover:shadow-indigo-200">Create</button>
                </div>
              </form>

              <div className="border-t border-slate-100"></div>

              <form action={createHealthCheckBoard}>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">New Health Check</label>
                <div className="flex gap-2">
                  <input required name="title" type="text" placeholder="e.g. Engineering — Q3" className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition placeholder:text-slate-300" />
                  <button type="submit" className="btn-primary bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200 hover:shadow-md hover:shadow-emerald-200">Create</button>
                </div>
              </form>
            </div>
          </div>

          {/* Join Session Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden card-hover">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
              <h2 className="text-white font-[Outfit] text-xl font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Join Session
              </h2>
            </div>
            <div className="p-6">
              <form action={joinBoard} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Session ID</label>
                  <input required name="joinCode" type="text" placeholder="Paste the session ID here…" className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400 transition placeholder:text-slate-300 font-mono" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Session Type</label>
                  <select name="boardType" className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400 transition appearance-none cursor-pointer">
                    <option value="retro">🔄 Retrospective</option>
                    <option value="health">🏥 Health Check</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary w-full bg-slate-900 text-white hover:bg-slate-800 shadow-sm mt-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  Join Session
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* ─── Footer ─── */}
        <div className="mt-12 text-center text-sm text-slate-400 animate-fade-in-up delay-300">
          <p>Runs entirely on your machine • SQLite database • Socket.io real-time sync</p>
        </div>
      </section>
    </main>
  );
}
