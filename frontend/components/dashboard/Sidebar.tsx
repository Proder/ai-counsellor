"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, School, MessageSquare, BookOpen, Settings, LogOut, List, GraduationCap, X } from "lucide-react";

const LINKS = [
    { name: "Overview", href: "/dashboard", icon: Home },
    { name: "University Discovery", href: "/universities", icon: School },
    { name: "My Shortlist", href: "/shortlist", icon: List },
    { name: "AI Counsellor", href: "/chat", icon: MessageSquare },
    { name: "Applications", href: "/applications", icon: BookOpen },
    { name: "Profile", href: "/profile", icon: Settings },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onboardingCompleted?: boolean;
}

export function Sidebar({ isOpen, onClose, onboardingCompleted = true }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className={`w-64 bg-[#25343F] flex flex-col h-full lg:h-screen fixed left-0 top-0 shadow-2xl z-[100] transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="p-8 border-b border-[#BFC9D1]/10 flex justify-between items-center">
                <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-lg group-hover:rotate-12 transition-transform" />
                    <h1 className="text-xl font-black text-[#EAEFEF] tracking-tight">
                        AI Counsellor
                    </h1>
                </Link>
                <button onClick={onClose} className="lg:hidden text-[#BFC9D1] hover:text-[#EAEFEF]">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
                {LINKS.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    const isLocked = !onboardingCompleted && link.href !== "/dashboard" && link.href !== "/profile";

                    return (
                        <Link
                            key={link.href}
                            href={isLocked ? "#" : link.href}
                            onClick={(e) => {
                                if (isLocked) e.preventDefault();
                                onClose();
                            }}
                            className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${isActive
                                ? "bg-[#FF9B51] text-[#25343F] shadow-lg shadow-[#FF9B51]/20 scale-[1.02]"
                                : "text-[#BFC9D1] hover:bg-[#EAEFEF]/5 hover:text-[#EAEFEF]"
                                } ${isLocked ? "opacity-30 cursor-not-allowed" : ""}`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? "text-[#25343F]" : "text-[#BFC9D1]"}`} />
                            <span className="flex-1">{link.name}</span>
                            {isLocked && <X className="w-3 h-3 text-[#BFC9D1]" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-[#BFC9D1]/10">
                <button
                    onClick={() => {
                        localStorage.removeItem("user_id");
                        window.location.href = "/login";
                    }}
                    className="flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold text-[#BFC9D1] hover:text-[#FF9B51] hover:bg-[#FF9B51]/10 w-full transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}
