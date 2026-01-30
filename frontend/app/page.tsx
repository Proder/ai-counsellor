import Link from "next/link";
import { ArrowRight, CheckCircle, ShieldCheck, Cpu, Globe, Users, Star, Quote, MessageSquare, Menu, X, Play } from "lucide-react";

const Testimonials = [
  { text: "Got into Georgia Tech with a 50% scholarship. The AI roadmap was scary accurate.", author: "Sarah Jenkins", field: "Computer Science" },
  { text: "It's like having a Harvard consultant in your pocket 24/7. The voice mode is insane.", author: "Michael Chen", field: "MBA @ Wharton" },
  { text: "Saved me $5000 in consultant fees. The Safe/Target/Dream split was perfect.", author: "Priya Patel", field: "Data Science" },
  { text: "My SOP improved 10x after the AI feedback. Highly recommend for serious applicants.", author: "James Wilson", field: "Engineering" },
  { text: "The rigid timeline kept me on track when I was about to give up.", author: "Aisha Khan", field: "Medical School" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#EAEFEF] text-[#25343F] selection:bg-[#FF9B51] selection:text-[#25343F] font-sans overflow-x-hidden">

      {/* Navbar */}
      <header className="py-5 px-6 md:px-12 flex justify-between items-center bg-[#25343F]/95 backdrop-blur-md text-[#EAEFEF] sticky top-0 z-[100] border-b border-[#EAEFEF]/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-lg">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-xl font-black tracking-tight uppercase tracking-widest hidden sm:inline">
            AI Counsellor <span className="text-[#FF9B51]"></span>
          </span>
        </div>
        <div className="flex gap-4 md:gap-8 items-center">
          <nav className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#BFC9D1]">
            {["Features", "Pricing"].map(item => (
              <Link key={item} href="#" className="hover:text-[#FF9B51] transition-colors">{item}</Link>
            ))}
          </nav>
          <div className="h-4 w-px bg-[#BFC9D1]/20 hidden md:block"></div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-xl border border-[#BFC9D1]/20 text-[10px] md:text-xs font-black uppercase tracking-widest text-[#EAEFEF] hover:bg-white/5 transition-all"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-[#FF9B51] text-[#25343F] rounded-xl hover:scale-105 transition-all font-black text-[10px] md:text-xs shadow-[0_0_20px_rgba(255,155,81,0.4)] uppercase tracking-widest flex items-center gap-2"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* Dynamic Hero Section */}
        <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden bg-[#25343F] text-[#EAEFEF]">
          {/* Background Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF9B51]/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">


            <h1 className="text-4xl md:text-6xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              YOUR PERSONAL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9B51] to-[#FF7A1A]">ADMISSION COUNSELLOR.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#BFC9D1] font-bold leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              The world's first agentic AI admissions consultant. We don't just advise; we plan, track, and execute your journey to the Ivy League.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-16 duration-1000">
              <Link href="/signup" className="px-12 py-6 bg-[#EAEFEF] text-[#25343F] rounded-2xl md:rounded-[1.5rem] font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-2xl flex items-center justify-center gap-3">
                Start Your Profile <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Hero Float UI */}
          <div className="mt-20 relative max-w-5xl mx-auto hidden md:block animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-t from-[#25343F] via-transparent to-transparent z-10 h-full w-full"></div>
            <div className="bg-[#1a252d] border border-[#BFC9D1]/10 rounded-t-[2.5rem] p-4 shadow-2xl skew-x-12 -rotate-6 opacity-30 absolute top-0 left-10 right-10 bottom-0 scale-95"></div>
            <div className="bg-[#1a252d] border border-[#BFC9D1]/10 rounded-t-[2.5rem] p-6 shadow-2xl relative z-0 overflow-hidden min-h-[400px]">
              {/* CSS Mock Interface */}
              <div className="flex gap-8 h-full">
                {/* Sidebar Mock */}
                <div className="w-1/4 space-y-4">
                  <div className="h-8 w-3/4 bg-white/10 rounded-lg animate-pulse"></div>
                  <div className="space-y-2 mt-8">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-4 w-full bg-white/5 rounded-md"></div>
                    ))}
                  </div>
                </div>
                {/* Content Mock */}
                <div className="flex-1 bg-[#25343F] rounded-t-2xl border border-white/5 p-6 relative">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/50"></div>
                  </div>
                  <div className="h-12 w-1/2 bg-white/10 rounded-xl mb-6"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-white/5 rounded-xl border border-white/5"></div>
                    <div className="h-32 bg-white/5 rounded-xl border border-white/5"></div>
                  </div>
                  <div className="mt-4 h-24 bg-[#FF9B51]/10 rounded-xl border border-[#FF9B51]/20 flex items-center justify-center text-[#FF9B51] font-black uppercase tracking-widest text-xs">
                    AI Analysis Complete
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scrolling Stats / Partners */}
        <div className="bg-[#FF9B51] py-6 overflow-hidden relative rotate-1 scale-105 shadow-xl z-20">
          <div className="flex gap-12 animate-infinite-scroll whitespace-nowrap">
            {[
              "Accepted at Stanford", "Trusted by 10,000+ Students", "$50M+ Scholarships Won",
              "98% Success Rate", "Ivy League Specialists", "24/7 AI Availability",
              "Accepted at MIT", "Accepted at Oxford", "4.9/5 Average Rating"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 text-[#25343F] font-black text-lg md:text-xl uppercase tracking-tighter">
                <Star className="w-6 h-6 fill-current" />
                <span>{text}</span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {[
              "Accepted at Stanford", "Trusted by 10,000+ Students", "$50M+ Scholarships Won",
              "98% Success Rate", "Ivy League Specialists", "24/7 AI Availability",
              "Accepted at MIT", "Accepted at Oxford", "4.9/5 Average Rating"
            ].map((text, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-4 text-[#25343F] font-black text-lg md:text-xl uppercase tracking-tighter">
                <Star className="w-6 h-6 fill-current" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Grid with Hover Effects */}
        <section className="py-32 px-6 max-w-8xl mx-auto bg-[#EAEFEF]">
          <div className="mb-24 md:flex justify-between items-end border-b border-[#25343F]/10 pb-12">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black text-[#25343F] tracking-tighter mb-4 leading-none">
                INTELLIGENCE <br /> AS A SERVICE.
              </h2>
              <p className="text-[#25343F]/60 font-bold text-lg">We replaced the expensive consultant with a deterministic AI model.</p>
            </div>
            <Link href="/signup" className="hidden md:flex items-center gap-2 font-black uppercase tracking-widest text-[#25343F] hover:text-[#FF9B51] transition-colors">
              Explore Capabilities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Profile Analysis", text: "We break down your GPA, scores, and extracurriculars into semantic data points to find your true fit." },
              { icon: Globe, title: "Global Database", text: "Real-time access to admission stats for 50+ top universities across US, UK, Canada & Europe." },
              { icon: CheckCircle, title: "Task Roadmap", text: "A rigid, stage-gated checklist generated instantly to keep you accountable until submission." },
              { icon: ShieldCheck, title: "Risk Assessment", text: "Proprietary algorithm categorizes schools into Safe, Target, and Dream with 92% accuracy." },
              { icon: MessageSquare, title: "Voice Consultant", text: "Talk to your AI counsellor naturally. Ask about SOPs, deadlines, or strategy while walking." },
              { icon: Cpu, title: "Application Ops", text: "Automated document tracking and deadline management across multiple portals." },
            ].map((card, i) => (
              <div key={i} className="group p-10 bg-white rounded-[2.5rem] border border-[#BFC9D1]/20 hover:border-[#FF9B51] transition-all hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <card.icon className="w-24 h-24 text-[#FF9B51] -rotate-12" />
                </div>
                <div className="w-14 h-14 bg-[#25343F] text-[#EAEFEF] rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform">
                  <card.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-[#25343F] mb-4 uppercase tracking-tight">{card.title}</h3>
                <p className="text-[#BFC9D1] font-bold leading-relaxed group-hover:text-[#25343F]/70 transition-colors">{card.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Infinite Testimonials Carousel */}
        <section className="py-32 bg-[#25343F] overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 mb-20 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-[#EAEFEF] mb-4 tracking-tighter">DON'T TAKE OUR WORD FOR IT.</h2>
            <p className="text-[#BFC9D1]">See what the class of 2025 has to say.</p>
          </div>

          {/* Carousel Track */}
          <div className="relative w-full">
            <div className="flex gap-8 animate-infinite-scroll w-max px-4">
              {[...Testimonials, ...Testimonials, ...Testimonials].map((t, i) => (
                <div key={i} className="w-[350px] md:w-[450px] p-10 bg-[#EAEFEF]/5 border border-[#EAEFEF]/10 rounded-[2.5rem] backdrop-blur-sm shrink-0 hover:bg-[#EAEFEF]/10 transition-colors cursor-default">
                  <div className="flex gap-1 text-[#FF9B51] mb-6">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-xl text-[#EAEFEF] font-bold leading-relaxed mb-8">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FF9B51] text-[#25343F] font-black flex items-center justify-center">
                      {t.author[0]}
                    </div>
                    <div className="text-left">
                      <div className="text-[#EAEFEF] font-black uppercase text-sm tracking-widest">{t.author}</div>
                      <div className="text-[#BFC9D1] text-[10px] font-black uppercase tracking-widest">{t.field}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6 max-w-5xl mx-auto text-center">
          <div className="bg-[#FF9B51] rounded-[3rem] p-12 md:p-24 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/20 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>

            <h2 className="text-5xl md:text-7xl font-black text-[#25343F] mb-8 tracking-tighter relative z-10 leading-[0.9]">
              YOUR FUTURE <br /> STARTS HERE.
            </h2>
            <p className="text-[#25343F]/80 text-xl font-bold mb-12 max-w-2xl mx-auto relative z-10">
              Join the waitlist for the most advanced agentic counsellor ever built.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup" className="px-12 py-5 bg-[#25343F] text-[#EAEFEF] rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
                Get Started Free
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-[#25343F]/10 bg-[#EAEFEF] text-center">
        <p className="text-[#25343F] font-black uppercase tracking-[0.2em] text-[10px]">
          © 2026 AI Counsellor Inc.
        </p>
      </footer>
    </div>
  );
}
