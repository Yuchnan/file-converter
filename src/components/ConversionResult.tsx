import { Download, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/converters";

interface ConversionResultProps {
    status: "idle" | "converting" | "done" | "error";
    result: Blob | null;
    outputName: string;
    error: string | null;
    onDownload: () => void;
}

export default function ConversionResult({ status, result, outputName, error, onDownload }: ConversionResultProps) {
    if (status === "idle") return null;

    return (
        <div
            className={cn(
                "rounded-2xl border p-5 transition-all duration-500",
                "animate-in fade-in slide-in-from-bottom-2",
                status === "converting" && "border-white/[0.06] bg-white/[0.02]",
                status === "done" && "border-emerald-500/20 bg-emerald-500/[0.04]",
                status === "error" && "border-red-500/20 bg-red-500/[0.04]"
            )}
        >
            {status === "converting" && (
                <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
                    <p className="text-sm font-medium text-white/60">Converting your file...</p>
                </div>
            )}

            {status === "done" && result && (
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <div>
                            <p className="text-sm font-medium text-white/80">Conversion complete</p>
                            <p className="text-xs text-white/30">
                                {outputName} · {formatFileSize(result.size)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onDownload}
                        className={cn(
                            "flex items-center gap-2 rounded-xl px-5 py-2.5",
                            "bg-white text-black text-sm font-semibold",
                            "transition-all duration-200 hover:bg-white/90 hover:shadow-lg hover:shadow-white/10",
                            "active:scale-[0.97]"
                        )}
                    >
                        <Download className="h-4 w-4" />
                        Download
                    </button>
                </div>
            )}

            {status === "error" && (
                <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                    <p className="text-sm text-red-300/80">{error || "Something went wrong"}</p>
                </div>
            )}
        </div>
    );
}
