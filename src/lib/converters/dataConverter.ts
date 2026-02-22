// CSV ↔ JSON converter — pure JavaScript
export function getDataOutputFormats(inputExt: string): string[] {
    if (inputExt === "csv") return ["json"];
    if (inputExt === "json") return ["csv"];
    return [];
}

function parseCSV(text: string): Record<string, string>[] {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => {
            row[h] = values[idx] || "";
        });
        rows.push(row);
    }

    return rows;
}

function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (inQuotes) {
            if (char === '"' && line[i + 1] === '"') {
                current += '"';
                i++;
            } else if (char === '"') {
                inQuotes = false;
            } else {
                current += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ",") {
                result.push(current.trim());
                current = "";
            } else {
                current += char;
            }
        }
    }
    result.push(current.trim());
    return result;
}

function jsonToCSV(data: Record<string, unknown>[]): string {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvLines = [headers.join(",")];

    for (const row of data) {
        const values = headers.map((h) => {
            const val = String(row[h] ?? "");
            if (val.includes(",") || val.includes('"') || val.includes("\n")) {
                return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        });
        csvLines.push(values.join(","));
    }

    return csvLines.join("\n");
}

export async function convertData(file: File, targetFormat: string): Promise<Blob> {
    const text = await file.text();
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (ext === "csv" && targetFormat === "json") {
        const data = parseCSV(text);
        const jsonStr = JSON.stringify(data, null, 2);
        return new Blob([jsonStr], { type: "application/json" });
    }

    if (ext === "json" && targetFormat === "csv") {
        const data = JSON.parse(text);
        if (!Array.isArray(data)) {
            throw new Error("JSON must be an array of objects to convert to CSV");
        }
        const csv = jsonToCSV(data);
        return new Blob([csv], { type: "text/csv" });
    }

    throw new Error(`Unsupported conversion: ${ext} → ${targetFormat}`);
}
