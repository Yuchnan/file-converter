// Central converter registry
import { getImageOutputFormats, convertImage } from "./imageConverter";
import { getDocumentOutputFormats, convertDocument } from "./documentConverter";
import { getDataOutputFormats, convertData } from "./dataConverter";
import { getTextOutputFormats, convertText } from "./textConverter";

export type ConversionCategory = "image" | "document" | "data" | "text";

interface FormatInfo {
    formats: string[];
    category: ConversionCategory;
}

const IMAGE_EXTS = ["png", "jpg", "jpeg", "webp", "bmp", "gif"];
const DOCUMENT_EXTS = ["docx", "doc", "pdf"];
const DATA_EXTS = ["csv", "json"];
const TEXT_EXTS = ["txt", "md", "markdown"];

export function getFileExtension(file: File): string {
    return file.name.split(".").pop()?.toLowerCase() || "";
}

export function getCategory(ext: string): ConversionCategory | null {
    if (IMAGE_EXTS.includes(ext)) return "image";
    if (DOCUMENT_EXTS.includes(ext)) return "document";
    if (DATA_EXTS.includes(ext)) return "data";
    if (TEXT_EXTS.includes(ext)) return "text";
    return null;
}

export function getAvailableOutputFormats(file: File): FormatInfo | null {
    const ext = getFileExtension(file);
    const category = getCategory(ext);
    if (!category) return null;

    let formats: string[] = [];
    switch (category) {
        case "image":
            formats = getImageOutputFormats(ext);
            break;
        case "document":
            formats = getDocumentOutputFormats(ext);
            break;
        case "data":
            formats = getDataOutputFormats(ext);
            break;
        case "text":
            formats = getTextOutputFormats(ext);
            break;
    }

    return formats.length > 0 ? { formats, category } : null;
}

export async function convertFile(file: File, targetFormat: string): Promise<Blob> {
    const ext = getFileExtension(file);
    const category = getCategory(ext);

    switch (category) {
        case "image":
            return convertImage(file, targetFormat);
        case "document":
            return convertDocument(file, targetFormat);
        case "data":
            return convertData(file, targetFormat);
        case "text":
            return convertText(file, targetFormat);
        default:
            throw new Error(`Unsupported file type: .${ext}`);
    }
}

export function getAcceptedFileTypes(): Record<string, string[]> {
    return {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/webp": [".webp"],
        "image/bmp": [".bmp"],
        "image/gif": [".gif"],
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        "application/msword": [".doc"],
        "text/csv": [".csv"],
        "application/json": [".json"],
        "text/plain": [".txt"],
        "text/markdown": [".md"],
    };
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getCategoryLabel(category: ConversionCategory): string {
    const labels: Record<ConversionCategory, string> = {
        image: "Image",
        document: "Document",
        data: "Data",
        text: "Text",
    };
    return labels[category];
}

export function getCategoryColor(category: ConversionCategory): string {
    const colors: Record<ConversionCategory, string> = {
        image: "text-violet-400",
        document: "text-blue-400",
        data: "text-emerald-400",
        text: "text-amber-400",
    };
    return colors[category];
}
