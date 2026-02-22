// Image converter using Canvas API — works 100% in browser
type ImageFormat = "image/png" | "image/jpeg" | "image/webp";

const FORMAT_MAP: Record<string, ImageFormat> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
};

export function getImageOutputFormats(inputExt: string): string[] {
    const all = ["png", "jpg", "webp"];
    return all.filter((f) => f !== inputExt && f !== (inputExt === "jpeg" ? "jpg" : ""));
}

export async function convertImage(file: File, targetFormat: string): Promise<Blob> {
    const mimeType = FORMAT_MAP[targetFormat];
    if (!mimeType) throw new Error(`Unsupported target format: ${targetFormat}`);

    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
            }

            // White background for JPEG (no alpha)
            if (mimeType === "image/jpeg") {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(url);
                    if (blob) resolve(blob);
                    else reject(new Error("Canvas toBlob failed"));
                },
                mimeType,
                0.92
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load image"));
        };

        img.src = url;
    });
}
