"use client";
import { genUploader } from "uploadthing/client";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";

export const { uploadFiles } = genUploader<OurFileRouter>();


export async function uploadSingleFile(
  file: File,
  options?: {
    onProgress?: (event: { progress: number }) => void;
    abortSignal?: AbortSignal;
  }
) {
  const { onProgress, abortSignal } = options || {};

  try {
    onProgress?.({ progress: 0 });

    let processedFile: File = file;

    // 🔹 Compress only if image

    onProgress?.({ progress: 10 });

    if (abortSignal?.aborted) {
      throw new Error("Upload cancelled");
    }

    // 🔹 Choose route depending on type
    const route = file.type.startsWith("image/")
      ? "imageUploader"
      : "fileUploader"; // <- you need to configure this in your UploadThing router

    const res = await uploadFiles(route, {
      files: [processedFile],
      signal: abortSignal,
      onUploadProgress: (progressEvent) => {
        const uploadProgress = Math.min(
          100,
          Math.round(progressEvent.progress * 0.9 + 10)
        );
        onProgress?.({ progress: uploadProgress });
      },
    });

    if (!res || res.length === 0) {
      return null;
    }

    const url = res[0].ufsUrl ?? res[0].url;

    onProgress?.({ progress: 100 });

    return url;
  } catch (error) {
    throw error;
  }
}


export const uploadFileWithProgress = async (
  file: File,
  fileIndex: number,
  totalFiles: number,
  toastId: string | number,
  fileLabel: string
): Promise<string | null> => {
  // Skip if file is not provided (optional file)
  if (!file) {
    console.log(`Skipping optional file: ${fileLabel}`);
    return null;
  }

  try {
    // Convert base64 to File if needed


    const url = await uploadSingleFile(file, {
      onProgress: ({ progress }) => {
        const overallProgress = calculateOverallProgress({
          totalFiles,
          currentFile: fileIndex + 1,
          currentProgress: progress,
        });
        toast.loading(`Uploading ${fileLabel}... ${overallProgress}%`, {
          id: toastId,
        });
      },
    });

    if (!url) {
      throw new Error(`Failed to upload ${fileLabel}`);
    }

    return url;
  } catch (error) {
    console.error(`Error uploading ${fileLabel}:`, error);
    throw new Error(`Failed to upload ${fileLabel}`);
  }
};

const calculateOverallProgress = (progress: UploadProgress): number => {
  const { totalFiles, currentFile, currentProgress } = progress;
  const completedFiles = currentFile - 1;
  const progressPerFile = 100 / totalFiles;

  return Math.floor(
    completedFiles * progressPerFile + (currentProgress * progressPerFile) / 100
  );
};

type UploadProgress = {
  totalFiles: number;
  currentFile: number;
  currentProgress: number;
};