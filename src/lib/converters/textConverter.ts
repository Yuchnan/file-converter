// Text / Markdown converter
export function getTextOutputFormats(inputExt: string): string[] {
    if (inputExt === "md" || inputExt === "markdown") return ["txt"];
    if (inputExt === "txt") return ["md"];
    return [];
}

function markdownToPlainText(md: string): string {
    let text = md;
    // Remove headers
    text = text.replace(/^#{1,6}\s+/gm, "");
    // Remove bold/italic
    text = text.replace(/\*\*(.+?)\*\*/g, "$1");
    text = text.replace(/\*(.+?)\*/g, "$1");
    text = text.replace(/__(.+?)__/g, "$1");
    text = text.replace(/_(.+?)_/g, "$1");
    // Remove links
    text = text.replace(/\[(.+?)\]\(.+?\)/g, "$1");
    // Remove images
    text = text.replace(/!\[.*?\]\(.+?\)/g, "");
    // Remove code blocks
    text = text.replace(/```[\s\S]*?```/g, "");
    text = text.replace(/`(.+?)`/g, "$1");
    // Remove blockquotes
    text = text.replace(/^>\s+/gm, "");
    // Remove horizontal rules
    text = text.replace(/^[-*_]{3,}\s*$/gm, "");
    // Remove list markers
    text = text.replace(/^[\s]*[-*+]\s+/gm, "• ");
    text = text.replace(/^[\s]*\d+\.\s+/gm, "");
    // Clean up extra whitespace
    text = text.replace(/\n{3,}/g, "\n\n");
    return text.trim();
}

function plainTextToMarkdown(text: string): string {
    const lines = text.split(/\r?\n/);
    const mdLines: string[] = [];
    let inParagraph = false;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            if (inParagraph) {
                mdLines.push("");
                inParagraph = false;
            }
            continue;
        }

        // Simple heuristic: short lines that end without punctuation could be headers
        if (trimmed.length < 60 && !trimmed.match(/[.,:;!?]$/) && !inParagraph) {
            mdLines.push(`## ${trimmed}`);
            mdLines.push("");
        } else {
            mdLines.push(trimmed);
            inParagraph = true;
        }
    }

    return mdLines.join("\n").trim();
}

export async function convertText(file: File, targetFormat: string): Promise<Blob> {
    const text = await file.text();
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if ((ext === "md" || ext === "markdown") && targetFormat === "txt") {
        const plain = markdownToPlainText(text);
        return new Blob([plain], { type: "text/plain" });
    }

    if (ext === "txt" && targetFormat === "md") {
        const md = plainTextToMarkdown(text);
        return new Blob([md], { type: "text/markdown" });
    }

    throw new Error(`Unsupported conversion: ${ext} → ${targetFormat}`);
}
