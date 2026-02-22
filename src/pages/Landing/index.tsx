import { useState, useCallback } from "react";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { saveAs } from "file-saver";
import FileDropZone from "@/components/FileDropZone";
import FormatSelector from "@/components/FormatSelector";
import ConversionResult from "@/components/ConversionResult";
import {
    getAvailableOutputFormats,
    convertFile,
    getFileExtension,
} from "@/lib/converters";

type Status = "idle" | "converting" | "done" | "error";

const Landing = () => {
    const [file, setFile] = useState<File | null>(null);
    const [outputFormats, setOutputFormats] = useState<string[]>([]);
    const [selectedFormat, setSelectedFormat] = useState<string>("");
    const [status, setStatus] = useState<Status>("idle");
    const [result, setResult] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [outputName, setOutputName] = useState<string>("");

    const handleFileSelect = useCallback((selectedFile: File) => {
        setFile(selectedFile);
        setStatus("idle");
        setResult(null);
        setError(null);

        const info = getAvailableOutputFormats(selectedFile);
        if (info) {
            setOutputFormats(info.formats);
            setSelectedFormat(info.formats[0]);
        } else {
            setOutputFormats([]);
            setSelectedFormat("");
        }
    }, []);

    const handleClear = useCallback(() => {
        setFile(null);
        setOutputFormats([]);
        setSelectedFormat("");
        setStatus("idle");
        setResult(null);
        setError(null);
    }, []);

    const handleConvert = useCallback(async () => {
        if (!file || !selectedFormat) return;

        setStatus("converting");
        setError(null);

        try {
            const blob = await convertFile(file, selectedFormat);
            const baseName = file.name.replace(/\.[^.]+$/, "");
            const name = `${baseName}.${selectedFormat}`;
            setOutputName(name);
            setResult(blob);
            setStatus("done");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Conversion failed");
            setStatus("error");
        }
    }, [file, selectedFormat]);

    const handleDownload = useCallback(() => {
        if (result) {
            saveAs(result, outputName);
        }
    }, [result, outputName]);

    return (
        <div className="relative min-h-screen bg-neutral-950 text-white">
            {/* Subtle gradient orbs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-violet-900/[0.07] blur-[120px]" />
                <div className="absolute -right-[20%] -bottom-[40%] h-[80%] w-[60%] rounded-full bg-blue-900/[0.05] blur-[120px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col px-6">
                {/* Header */}
                <header className="flex items-center justify-between pt-8 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
                            <Zap className="h-4 w-4 text-violet-400" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight text-white/80">
                            FileConvert
                        </span>
                    </div>
                    <a
                        href="https://github.com/Yuchnan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/25 transition-colors hover:text-white/50"
                    >
                        r.Yuchnan
                    </a>
                </header>

                {/* Hero */}
                <main className="flex flex-1 flex-col items-center justify-center py-12">
                    <div className="w-full space-y-8 text-center">
                        <div className="space-y-3">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                                Convert files,{" "}
                                <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                                    instantly
                                </span>
                            </h1>
                            <p className="mx-auto max-w-md text-base text-white/35">
                                No uploads to servers. Everything runs in your browser — fast,
                                private, and free.
                            </p>
                        </div>

                        {/* Converter Card */}
                        <div className="mx-auto w-full max-w-xl space-y-4 text-left">
                            <FileDropZone
                                file={file}
                                onFileSelect={handleFileSelect}
                                onClear={handleClear}
                            />

                            {file && outputFormats.length > 0 && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4 duration-300">
                                    <div className="flex items-end gap-3">
                                        <div className="flex-1">
                                            <FormatSelector
                                                formats={outputFormats}
                                                selected={selectedFormat}
                                                onChange={setSelectedFormat}
                                            />
                                        </div>
                                        <button
                                            onClick={handleConvert}
                                            disabled={status === "converting"}
                                            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Convert
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {file && outputFormats.length === 0 && (
                                <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4 text-center">
                                    <p className="text-sm text-amber-300/70">
                                        No conversion available for{" "}
                                        <span className="font-semibold">.{getFileExtension(file)}</span>{" "}
                                        files
                                    </p>
                                </div>
                            )}

                            <ConversionResult
                                status={status}
                                result={result}
                                outputName={outputName}
                                error={error}
                                onDownload={handleDownload}
                            />
                        </div>

                        {/* Features */}
                        <div className="mx-auto grid max-w-xl grid-cols-3 gap-6 pt-8">
                            {[
                                {
                                    icon: <Zap className="h-4 w-4" />,
                                    title: "Instant",
                                    desc: "No waiting",
                                },
                                {
                                    icon: <Shield className="h-4 w-4" />,
                                    title: "Private",
                                    desc: "No uploads",
                                },
                                {
                                    icon: <Globe className="h-4 w-4" />,
                                    title: "Free",
                                    desc: "No limits",
                                },
                            ].map((f) => (
                                <div key={f.title} className="text-center">
                                    <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white/25">
                                        {f.icon}
                                    </div>
                                    <p className="text-sm font-medium text-white/50">{f.title}</p>
                                    <p className="text-xs text-white/20">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="pb-6 text-center">
                    <p className="text-xs text-white/15">
                        All conversions happen locally in your browser
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Landing;