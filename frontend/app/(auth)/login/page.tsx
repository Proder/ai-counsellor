"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, LogIn } from "lucide-react";

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Invalid credentials");
            }

            const data = await res.json();
            // Store user_id if needed for UI, but token is now in HttpOnly cookie
            if (data.user_id) localStorage.setItem("user_id", data.user_id);

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#25343F] p-4 md:p-6 overflow-x-hidden">
            <div className="bg-[#EAEFEF] p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-md border border-[#BFC9D1]/20 animate-in zoom-in duration-500">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-[#FF9B51] p-3 rounded-2xl text-[#25343F] mb-4 shadow-lg shrink-0">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-[#25343F] tracking-tight leading-tight">Welcome Back</h1>
                    <p className="text-[#BFC9D1] font-bold mt-1 text-sm md:text-base">Resume your journey</p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-6 text-xs md:text-sm font-bold border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] md:text-xs font-black text-[#25343F] uppercase tracking-widest ml-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-5 py-4 bg-white border-2 border-[#BFC9D1]/20 rounded-xl md:rounded-2xl focus:border-[#FF9B51] outline-none transition-all font-bold text-sm md:text-base text-[#25343F] shadow-inner"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] md:text-xs font-black text-[#25343F] uppercase tracking-widest ml-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-5 py-4 bg-white border-2 border-[#BFC9D1]/20 rounded-xl md:rounded-2xl focus:border-[#FF9B51] outline-none transition-all font-bold text-sm md:text-base text-[#25343F] shadow-inner"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 md:py-5 bg-[#25343F] text-[#EAEFEF] rounded-xl md:rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all font-black text-sm md:text-lg shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? "LOGGING IN..." : "LOGIN"}
                        {!loading && <LogIn className="w-5 h-5 text-[#FF9B51]" />}
                    </button>
                </form>

                <p className="mt-8 text-center text-xs md:text-sm font-bold text-[#BFC9D1]">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-[#FF9B51] hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
