import { InputHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-black text-[#25343F] uppercase tracking-widest mb-2 ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "w-full px-5 py-4 bg-white border-2 rounded-2xl outline-none transition-all font-bold text-[#25343F] shadow-inner",
                        error ? "border-red-500" : "border-[#BFC9D1]/20 focus:border-[#FF9B51]",
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-2 text-xs font-bold text-red-500 ml-1">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
