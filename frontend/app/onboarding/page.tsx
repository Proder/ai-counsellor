"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckCircle, ChevronRight, ChevronLeft, GraduationCap, Globe, Wallet, ClipboardCheck, Check } from "lucide-react";
import { toast } from "sonner";

const STEPS = ["Academic Background", "Study Goal", "Budget & Funding", "Readiness"];
const ICONS = [GraduationCap, Globe, Wallet, ClipboardCheck];

export default function Onboarding() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        // Academic
        current_education_level: "",
        degree_major: "",
        graduation_year: "",
        gpa: "",
        // Goal
        target_degree: "Masters",
        target_field: "",
        target_intake_year: "2026",
        preferred_countries: [] as string[],
        // Budget
        budget_range: "",
        funding_plan: "Self-funded",
        // Readiness
        test_scores: [] as string[],
        sop_status: "Not Started",
    });

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < STEPS.length - 1) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem("user_id");
            if (!userId) {
                router.push("/login");
                return;
            }

            const res = await fetch(`/api/profile/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: parseInt(userId),
                    ...formData,
                    graduation_year: parseInt(formData.graduation_year) || 0,
                    target_intake_year: parseInt(formData.target_intake_year) || 0,
                    gpa: parseFloat(formData.gpa) || 0,
                    onboarding_completed: true,
                    current_stage: "Stage 2: Discovering Universities"
                }),
            });

            if (res.ok) {
                toast.success("Profile saved successfully!");
                router.push("/dashboard");
            } else {
                toast.error("Failed to save profile. Please try again.");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error submitting profile");
        } finally {
            setLoading(false);
        }
    };

    const toggleTest = (test: string) => {
        const current = [...formData.test_scores];
        if (current.includes(test)) {
            handleChange("test_scores", current.filter(t => t !== test));
        } else {
            handleChange("test_scores", [...current, test]);
        }
    };

    const StepIcon = ICONS[step];

    return (
        <div className="min-h-screen bg-[#25343F] flex flex-col items-center justify-center p-4 md:p-6 overflow-x-hidden">
            <div className="w-full max-w-2xl bg-[#EAEFEF] rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-[#BFC9D1]/20 overflow-hidden">
                {/* Progress Bar */}
                <div className="bg-[#BFC9D1]/20 h-2.5 md:h-3 w-full">
                    <div
                        className="h-full bg-gradient-to-r from-[#FF9B51] to-[#FF7A1A] transition-all duration-500 rounded-r-full"
                        style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    />
                </div>

                <div className="p-6 md:p-14">
                    <div className="mb-8 md:mb-10 flex items-center gap-4 md:gap-6">
                        <div className="bg-[#FF9B51] p-3 md:p-4 rounded-xl md:rounded-2xl text-[#25343F] shadow-lg shrink-0">
                            <StepIcon className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <div>
                            <p className="text-[#FF9B51] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-1">Step {step + 1} of {STEPS.length}</p>
                            <h2 className="text-xl md:text-3xl font-black text-[#25343F] tracking-tight leading-tight">{STEPS[step]}</h2>
                        </div>
                    </div>

                    <div className="space-y-6 md:space-y-8 min-h-[350px] md:min-h-[400px]">
                        {step === 0 && (
                            <div className="space-y-5 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="space-y-2">
                                    <label className="block text-[10px] md:text-xs font-black text-[#25343F] uppercase tracking-widest ml-1">Your Full Name</label>
                                    <input
                                        className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-[#BFC9D1]/20 rounded-xl md:rounded-2xl outline-none focus:border-[#FF9B51] transition-all font-bold text-[#25343F] shadow-inner"
                                        value={formData.full_name}
                                        onChange={(e) => handleChange("full_name", e.target.value)}
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] md:text-xs font-black text-[#25343F] uppercase tracking-widest ml-1">Current Education Level</label>
                                    <select
                                        className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-[#BFC9D1]/20 rounded-xl md:rounded-2xl outline-none focus:border-[#FF9B51] transition-all font-bold text-[#25343F] appearance-none"
                                        value={formData.current_education_level}
                                        onChange={(e) => handleChange("current_education_level", e.target.value)}
                                    >
                                        <option value="">Select Education...</option>
                                        <option value="High School">High School</option>
                                        <option value="Bachelor's">Bachelor's Degree</option>
                                        <option value="Master's">Master's Degree</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] md:text-xs font-black text-[#25343F] uppercase tracking-widest ml-1">Degree / Major</label>
                                    <input
                                        className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-[#BFC9D1]/20 rounded-xl md:rounded-2xl outline-none focus:border-[#FF9B51] transition-all font-bold text-[#25343F] shadow-inner"
                                        value={formData.degree_major}
                                        onChange={(e) => handleChange("degree_major", e.target.value)}
                                        placeholder="e.g. Computer Science"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] md:text-xs font-black text-[#25343F] uppercase tracking-widest ml-1">Graduation Year</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-[#BFC9D1]/20 rounded-xl md:rounded-2xl outline-none focus:border-[#FF9B51] transition-all font-bold text-[#25343F] shadow-inner"
                                            value={formData.graduation_year}
                                            onChange={(e) => handleChange("graduation_year", e.target.value)}
                                            placeholder="2025"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] md:text-xs font-black text-[#25343F] uppercase tracking-widest ml-1">GPA / Percentage</label>
                                        <input
                                            className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-[#BFC9D1]/20 rounded-xl md:rounded-2xl outline-none focus:border-[#FF9B51] transition-all font-bold text-[#25343F] shadow-inner"
                                            value={formData.gpa}
                                            onChange={(e) => handleChange("gpa", e.target.value)}
                                            placeholder="e.g. 3.8 or 85%"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="space-y-3">
                                    <label className="block text-[10px] md:text-xs font-black text-[#25343F] uppercase tracking-widest ml-1">Target Degree</label>
                                    <div className="flex flex-wrap gap-2 md:gap-3">
                                        {["Bachelor's", "Masters", "MBA", "PhD"].map((deg) => (
                                            <button
                                                key={deg}
                                                onClick={() => handleChange("target_degree", deg)}
                                                className={`flex-1 min-w-[100px] px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl border-2 transition-all font-black text-xs md:text-sm ${formData.target_degree === deg
                                                    ? "bg-[#25343F] border-[#25343F] text-[#FF9B51] shadow-lg"
                                                    : "bg-white border-[#BFC9D1]/20 text-[#25343F] hover:border-[#FF9B51]/50"
                                                    }`}
                                            >
                                                {deg}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] md:text-xs font-black text-[#25343F] uppercase tracking-widest ml-1">Target Field of Study</label>
                                    <input
                                        className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-[#BFC9D1]/20 rounded-xl md:rounded-2xl outline-none focus:border-[#FF9B51] transition-all font-bold text-[#25343F]"
                                        value={formData.target_field}
                                        onChange={(e) => handleChange("target_field", e.target.value)}
                                        placeholder="e.g. Data Science"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] md:text-xs font-black text-[#25343F] uppercase tracking-widest ml-1">Target Intake Year</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-[#BFC9D1]/20 rounded-xl md:rounded-2xl outline-none focus:border-[#FF9B51] transition-all font-bold text-[#25343F]"
                                        value={formData.target_intake_year}
                                        onChange={(e) => handleChange("target_intake_year", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] md:text-xs font-black text-[#25343F] uppercase tracking-widest ml-1">Preferred Countries</label>
                                    <div className="flex flex-wrap gap-2">
                                        {["USA", "UK", "Canada", "Australia", "Germany"].map((country) => (
                                            <button
                                                key={country}
                                                onClick={() => {
                                                    const current = [...formData.preferred_countries];
                                                    if (current.includes(country)) {
                                                        handleChange("preferred_countries", current.filter(c => c !== country));
                                                    } else {
                                                        handleChange("preferred_countries", [...current, country]);
                                                    }
                                                }}
                                                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-[11px] font-black border-2 uppercase tracking-widest transition-all ${formData.preferred_countries.includes(country)
                                                    ? "bg-[#FF9B51] border-[#FF9B51] text-[#25343F] shadow-md"
                                                    : "bg-white border-[#BFC9D1]/20 text-[#BFC9D1] hover:border-[#FF9B51]/50"
                                                    }`}
                                            >
                                                {country}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="space-y-4">
                                    <label className="block text-[10px] md:text-xs font-black text-[#25343F] uppercase tracking-widest ml-1">Annual Budget (Tuition + Living)</label>
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        {["< $20k", "$20k - $40k", "$40k - $60k", "$60k+"].map((range) => (
                                            <button
                                                key={range}
                                                onClick={() => handleChange("budget_range", range)}
                                                className={`p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 text-left transition-all font-black ${formData.budget_range === range
                                                    ? "border-[#FF9B51] bg-[#FF9B51]/10 text-[#25343F] shadow-lg"
                                                    : "bg-white border-[#BFC9D1]/20 text-[#BFC9D1] hover:border-[#FF9B51]/30"
                                                    }`}
                                            >
                                                <span className="text-sm md:text-lg">{range}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] md:text-xs font-black text-[#25343F] uppercase tracking-widest ml-1 mt-4">Primary Funding Source</label>
                                    <select
                                        className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-[#BFC9D1]/20 rounded-xl md:rounded-2xl outline-none focus:border-[#FF9B51] transition-all font-bold text-[#25343F] appearance-none"
                                        value={formData.funding_plan}
                                        onChange={(e) => handleChange("funding_plan", e.target.value)}
                                    >
                                        <option value="Self-funded">Self-funded (Family Support)</option>
                                        <option value="Loan">Education Loan</option>
                                        <option value="Scholarship">Full Scholarship Dependent</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="space-y-4">
                                    <label className="block text-[10px] md:text-xs font-black text-[#25343F] uppercase tracking-widest ml-1">Assessment Readiness</label>
                                    <div className="p-6 md:p-8 bg-white rounded-2xl md:rounded-[2.5rem] border-2 border-[#BFC9D1]/20 shadow-sm relative overflow-hidden group">
                                        <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:rotate-12 transition-transform">
                                            <ClipboardCheck className="w-24 h-24 md:w-32 md:h-32" />
                                        </div>
                                        <p className="text-[#25343F] font-black text-sm md:text-base mb-6 leading-tight">Which standardized tests have you taken or are planning to take?</p>
                                        <div className="flex flex-wrap gap-2 md:gap-3">
                                            {["Pending", "IELTS", "TOEFL", "GRE", "GMAT", "SAT"].map((test) => (
                                                <button
                                                    key={test}
                                                    onClick={() => toggleTest(test)}
                                                    className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl border-2 font-black text-[10px] md:text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${formData.test_scores.includes(test)
                                                        ? "bg-[#25343F] border-[#25343F] text-[#FF9B51] shadow-md"
                                                        : "bg-white border-[#BFC9D1]/20 text-[#BFC9D1] hover:border-[#FF9B51]/30"
                                                        }`}
                                                >
                                                    {formData.test_scores.includes(test) && <Check className="w-3 h-3" />}
                                                    {test}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] md:text-xs font-black text-[#25343F] uppercase tracking-widest ml-1">SOP / Essay Status</label>
                                        <select
                                            className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-[#BFC9D1]/20 rounded-xl md:rounded-2xl outline-none focus:border-[#FF9B51] transition-all font-bold text-[#25343F] appearance-none"
                                            value={formData.sop_status}
                                            onChange={(e) => handleChange("sop_status", e.target.value)}
                                        >
                                            <option value="Not Started">Not Started</option>
                                            <option value="Drafting">In Drafting Phase</option>
                                            <option value="Ready">Polished and Ready</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col-reverse md:flex-row justify-between mt-8 md:mt-12 pt-6 md:pt-10 border-t-2 border-[#BFC9D1]/10 gap-4">
                        <button
                            onClick={handleBack}
                            disabled={step === 0}
                            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black text-xs md:text-sm transition-all ${step === 0 ? "opacity-0 invisible" : "text-[#BFC9D1] hover:text-[#25343F] hover:bg-white"
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /> BACK
                        </button>

                        <div className="flex flex-col md:flex-row gap-3">
                            {step === STEPS.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full md:w-auto flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-[#25343F] text-[#EAEFEF] rounded-xl md:rounded-[1.5rem] font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                                >
                                    {loading ? "SAVING..." : "COMPLETE PROFILE"}
                                    {!loading && <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#FF9B51]" />}
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="w-full md:w-auto flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-[#25343F] text-[#EAEFEF] rounded-xl md:rounded-[1.5rem] font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl group"
                                >
                                    PROCEED
                                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#FF9B51] group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
