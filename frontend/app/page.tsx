import Link from "next/link";
import { ArrowRight, GraduationCap, CheckCircle, Sparkles, Zap, ShieldCheck, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#EAEFEF] text-[#25343F] selection:bg-[#FF9B51] selection:text-[#25343F]">
      <header className="py-5 px-6 md:px-12 flex justify-between items-center bg-[#25343F] text-[#EAEFEF] sticky top-0 z-[100] shadow-xl">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="AI Counsellor Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-lg shadow-lg" />
          <span className="text-lg md:text-xl font-black tracking-tight uppercase tracking-widest hidden sm:inline">
            AI Counsellor
          </span>
        </div>
        <div className="flex gap-3 md:gap-6 items-center">
          <Link
            href="/login"
            className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#BFC9D1] hover:text-[#FF9B51] transition-colors"
          >
            SIGN IN
          </Link>
          <Link
            href="/signup"
            className="px-5 md:px-8 py-2.5 bg-[#FF9B51] text-[#25343F] rounded-xl hover:scale-105 transition-all font-black text-[10px] md:text-xs shadow-lg uppercase tracking-widest"
          >
            GET STARTED
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FF9B51]/10 blur-[120px] rounded-full -z-10"></div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25343F] text-[#FF9B51] font-black text-[10px] md:text-xs mb-10 border border-[#BFC9D1]/10 shadow-xl uppercase tracking-[0.2em] animate-in slide-in-from-top-4 duration-500">
            Next-Gen LLM Inference Engine
          </div>

          <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black tracking-tighter mb-8 leading-[0.85] text-[#25343F] animate-in fade-in slide-in-from-bottom-8 duration-700">
            ELITE STUDY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9B51] to-[#FF7A1A]">ADVISORY.</span>
          </h1>

          <p className="text-lg md:text-2xl text-[#25343F]/70 mb-12 max-w-2xl mx-auto leading-relaxed font-bold tracking-tight animate-in fade-in slide-in-from-bottom-12 duration-1000">
            Precision university shortlisting and application tracking powered by ultra-low latency AI inference.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-16 duration-1000 transition-all">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-10 py-5 bg-[#25343F] text-[#EAEFEF] text-sm md:text-lg rounded-2xl hover:bg-[#1a252d] transition-all shadow-2xl flex items-center justify-center gap-3 group font-black uppercase tracking-widest active:scale-95"
            >
              INITIALIZE PORTAL
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-[#FF9B51]" />
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-[#25343F] text-[#EAEFEF] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10 text-left">
            {[
              {
                title: "HYPER-FAST INFERENCE",
                desc: "Powered by AI for real-time strategic counsel and document analysis.",
                icon: Cpu,
                color: "#FF9B51"
              },
              {
                title: "SCORECARD ANALYTICS",
                desc: "Live integration with US College Scorecard for data-driven university discovery and safety metrics.",
                icon: ShieldCheck,
                color: "#FF9B51"
              },
              {
                title: "LOCKED COMMITMENT",
                desc: "A rigid stage-gated process that ensures focus by locking your final decisions into a roadmap.",
                icon: CheckCircle,
                color: "#FF9B51"
              },
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-[#EAEFEF]/5 border border-[#BFC9D1]/10 hover:border-[#FF9B51]/40 transition-all group hover:bg-[#EAEFEF]/10">
                <div className="w-16 h-16 bg-[#FF9B51] rounded-2xl flex items-center justify-center mb-8 text-[#25343F] shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black mb-4 tracking-tight leading-none uppercase">{feature.title}</h3>
                <p className="text-[#BFC9D1] leading-relaxed font-bold text-sm tracking-tight">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 text-center text-[#BFC9D1] text-[10px] md:text-xs bg-[#1a252d] border-t border-[#BFC9D1]/5 font-black uppercase tracking-[0.3em]">
        <div className="mb-8 flex flex-wrap justify-center gap-6 md:gap-12">
          <Link href="#" className="hover:text-[#FF9B51] transition-colors">Architecture</Link>
          <Link href="#" className="hover:text-[#FF9B51] transition-colors">Privacy Protcol</Link>
          <Link href="#" className="hover:text-[#FF9B51] transition-colors">Inference Stats</Link>
        </div>
        <div className="opacity-40">
          © 2026 AI COUNSELLOR | <br className="sm:hidden" /> BUILT FOR HACKATHON
        </div>
      </footer>
    </div>
  );
}
