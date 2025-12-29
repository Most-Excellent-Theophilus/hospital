"use client";

import { genUploader } from "uploadthing/client";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import z from "zod";

export const { uploadFiles } = genUploader<OurFileRouter>();

type UploadOptions = {
  onProgress?: (event: { progress: number }) => void;
  abortSignal?: AbortSignal;
};




export const uploadMultipleFiles = async ({
  files,
  options,
}: {
  files: File[];
  options?: UploadOptions;
}) => {
  const { onProgress, abortSignal } = options ?? {};

  const images = files.filter((f) => f.type.startsWith("image/"));
  const documents = files.filter((f) => !f.type.startsWith("image/"));

  let imageProgress = 0;
  let docProgress = 0;

  const reportProgress = () => {
    const total =
      images.length + documents.length || 1;

    const weightedProgress =
      (imageProgress * images.length +
        docProgress * documents.length) /
      total;

    onProgress?.({ progress: Math.round(weightedProgress) });
  };

  const uploadImages = uploadFiles("imageUploader", {
    files: images,
    signal: abortSignal,
    onUploadProgress: (e) => {
      imageProgress = e.progress * 100;
      reportProgress();
    },
  });

  const uploadDocuments = uploadFiles("fileUploader", {
    files: documents,
    signal: abortSignal,
    onUploadProgress: (e) => {
      docProgress = e.progress * 100;
      reportProgress();
    },
  });


  try {
    const [uploadedImages, uploadedDocs] = await Promise.all([
      uploadImages,
      uploadDocuments,
    ]);

    onProgress?.({ progress: 100 });


   
    const doclinks = [...uploadedImages,
    ...uploadedDocs]
   

    return doclinks;
  } catch (error) {
    if (abortSignal?.aborted) {
      throw new Error("Upload aborted");
    }
    throw error;
  }
};
