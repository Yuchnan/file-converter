import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAcceptedFileTypes, formatFileSize, getAvailableOutputFormats, getCategoryLabel, getCategoryColor } from "@/lib/converters";

interface FileDropZoneProps {
    file: File | null;
    onFileSelect: (file: File) => void;
    onClear: () => void;
}

export default function FileDropZone({ file, onFileSelect, onClear }: FileDropZoneProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onFileSelect(acceptedFiles[0]);
            }
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: getAcceptedFileTypes(),
        multiple: false,
    });

    if (file) {
        const info = getAvailableOutputFormats(file);
        return (
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClear();
                    }}
                    className="absolute top-3 right-3 rounded-full p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/[0.06]">
                        <FileIcon className="h-7 w-7 text-white/60" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white/90">{file.name}</p>
                        <div className="mt-1 flex items-center gap-2 text-sm text-white/40">
                            <span>{formatFileSize(file.size)}</span>
                            {info && (
                                <>
                                    <span>·</span>
                                    <span className={cn("font-medium", getCategoryColor(info.category))}>
                                        {getCategoryLabel(info.category)}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                "group cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300",
                isDragActive
                    ? "border-violet-500/50 bg-violet-500/[0.05]"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
            )}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
                <div
                    className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300",
                        isDragActive
                            ? "bg-violet-500/20 text-violet-400"
                            : "bg-white/[0.06] text-white/30 group-hover:bg-white/[0.08] group-hover:text-white/50"
                    )}
                >
                    <Upload className="h-7 w-7" />
                </div>
                <div>
                    <p className="text-base font-medium text-white/70">
                        {isDragActive ? "Drop file here" : "Drop your file here"}
                    </p>
                    <p className="mt-1 text-sm text-white/30">
                        or <span className="text-violet-400/80 underline underline-offset-2">browse</span> to choose a file
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-1.5">
                    {["PNG", "JPG", "WEBP", "PDF", "DOCX", "CSV", "JSON", "TXT", "MD"].map((ext) => (
                        <span
                            key={ext}
                            className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[11px] font-medium tracking-wide text-white/25"
                        >
                            {ext}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
