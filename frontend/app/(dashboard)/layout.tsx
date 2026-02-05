"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { useState, useEffect } from "react";
import { Menu, X, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const pathname = usePathname();

    useEffect(() => {
        fetch(`/api/profile/me`)
            .then(res => {
                if (res.status === 401) window.location.href = "/login";
                return res.json();
            })
            .then(data => {
                setProfile(data);
                if (data && !data.onboarding_completed) {
                    window.location.href = "/onboarding";
                }
            });
    }, [pathname]);

    // Hide floating button on the chat page itself
    const showFloatingButton = pathname !== "/chat";

    return (
        <div className="min-h-screen bg-[#EAEFEF] text-[#25343F]">
            {/* Mobile Header */}
            <header className="lg:hidden bg-[#25343F] text-[#EAEFEF] p-4 flex justify-between items-center sticky top-0 z-[40] shadow-xl">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <img src="/logo.png" alt="AI Counsellor Logo" className="w-8 h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <span className="font-black text-sm uppercase tracking-widest">AI Counsellor</span>
                </Link>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-[#25343F]/60 backdrop-blur-sm z-[80] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onboardingCompleted={profile?.onboarding_completed} />

            <main className="lg:ml-64 p-4 md:p-8 lg:p-12 min-h-screen overflow-x-hidden">
                {children}
            </main>

            {/* Floating AI Counsellor Button */}
            {showFloatingButton && (
                <Link href="/chat">
                    <button
                        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[60] bg-[#FF9B51] text-[#25343F] p-4 md:p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group animate-bounce"
                        aria-label="Open AI Counsellor Chat"
                    >
                        <MessageSquare className="w-6 h-6 md:w-7 md:h-7 group-hover:rotate-12 transition-transform" />
                    </button>
                </Link>
            )}
        </div>
    );
}
