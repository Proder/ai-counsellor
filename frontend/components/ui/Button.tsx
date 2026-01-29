import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-[#25343F] text-[#EAEFEF] hover:bg-[#1a252d] shadow-lg",
            secondary: "bg-[#FF9B51] text-[#25343F] hover:scale-[1.02] shadow-lg",
            outline: "border-2 border-[#BFC9D1]/30 bg-transparent hover:border-[#FF9B51] text-[#25343F]",
            ghost: "bg-transparent hover:bg-[#BFC9D1]/10 text-[#25343F]",
        };

        const sizes = {
            sm: "px-4 py-2 text-xs font-black uppercase tracking-widest",
            md: "px-6 py-3 font-black text-sm uppercase tracking-widest",
            lg: "px-10 py-5 text-lg font-black uppercase tracking-widest shadow-xl",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-2xl transition-all focus:outline-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
