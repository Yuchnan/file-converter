// Document converter: Word↔PDF using mammoth, html2pdf.js, pdfjs-dist, docx
import mammoth from "mammoth";
import { Document, Packer, Paragraph, TextRun } from "docx";
import * as pdfjsLib from "pdfjs-dist";

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export function getDocumentOutputFormats(inputExt: string): string[] {
    if (inputExt === "docx" || inputExt === "doc") return ["pdf"];
    if (inputExt === "pdf") return ["docx"];
    return [];
}

export async function convertDocxToPdf(file: File): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const html = result.value;

    // Create a container for rendering
    const container = document.createElement("div");
    container.innerHTML = html;
    container.style.cssText = `
    font-family: 'Inter', 'Segoe UI', sans-serif;
    font-size: 12pt;
    line-height: 1.6;
    color: #1a1a1a;
    padding: 40px;
    max-width: 800px;
    background: white;
  `;
    document.body.appendChild(container);

    // Dynamic import html2pdf to avoid SSR issues
    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
        margin: 10,
        filename: file.name.replace(/\.(docx?|doc)$/i, ".pdf"),
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
    };

    const blob: Blob = await html2pdf().set(opt).from(container).outputPdf("blob");
    document.body.removeChild(container);
    return blob;
}

export async function convertPdfToDocx(file: File): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const paragraphs: Paragraph[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        let pageText = "";

        for (const item of textContent.items) {
            if ("str" in item) {
                pageText += item.str;
                if ("hasEOL" in item && item.hasEOL) {
                    paragraphs.push(
                        new Paragraph({
                            children: [new TextRun({ text: pageText, font: "Calibri", size: 24 })],
                        })
                    );
                    pageText = "";
                }
            }
        }

        if (pageText) {
            paragraphs.push(
                new Paragraph({
                    children: [new TextRun({ text: pageText, font: "Calibri", size: 24 })],
                })
            );
        }

        // Page separator
        if (i < pdf.numPages) {
            paragraphs.push(new Paragraph({ children: [] }));
        }
    }

    const doc = new Document({
        sections: [{ children: paragraphs }],
    });

    const buffer = await Packer.toBlob(doc);
    return buffer;
}

export async function convertDocument(file: File, targetFormat: string): Promise<Blob> {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if ((ext === "docx" || ext === "doc") && targetFormat === "pdf") {
        return convertDocxToPdf(file);
    }
    if (ext === "pdf" && targetFormat === "docx") {
        return convertPdfToDocx(file);
    }

    throw new Error(`Unsupported conversion: ${ext} → ${targetFormat}`);
}
