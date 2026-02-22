import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FormatSelectorProps {
    formats: string[];
    selected: string;
    onChange: (format: string) => void;
}

export default function FormatSelector({ formats, selected, onChange }: FormatSelectorProps) {
    return (
        <div className="relative">
            <label className="mb-2 block text-sm font-medium text-white/40">Convert to</label>
            <div className="relative">
                <select
                    value={selected}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(
                        "w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3",
                        "text-sm font-semibold tracking-widest text-white/80 uppercase",
                        "transition-all duration-200",
                        "hover:border-white/20 hover:bg-white/[0.06]",
                        "focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                    )}
                >
                    {formats.map((f) => (
                        <option key={f} value={f} className="bg-neutral-900 text-white">
                            .{f}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            </div>
        </div>
    );
}
