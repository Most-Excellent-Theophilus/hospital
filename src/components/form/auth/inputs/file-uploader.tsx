"use client";

import React from "react";
import { Control, FieldValues, Path, ControllerRenderProps } from "react-hook-form";
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneTrigger,
  useDropzone,
} from "@/components/ui/dropzone";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CloudUpload, File as FileIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

/* ============================================================
   Types
============================================================ */

type DropzoneFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: React.ReactNode;
  description?: string;
  maxFiles?: number;
  maxSize?: number; // MB
  className?: string;
};

type InnerProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  error?: string;
  label: React.ReactNode;
  description?: string;
  maxFiles: number;
  maxSize: number;
  className?: string;
};

/* ============================================================
   Parent (NO hooks here)
============================================================ */

const DropzoneField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  maxFiles = 10,
  maxSize = 10,
  className,
}: DropzoneFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <DropzoneInner
          field={field}
          error={fieldState.error?.message}
          label={label}
          description={description}
          maxFiles={maxFiles}
          maxSize={maxSize}
          className={className}
        />
      )}
    />
  );
};

/* ============================================================
   Inner Component (Hooks live here)
============================================================ */

function DropzoneInner<T extends FieldValues>({
  field,
  error,
  label,
  description,
  maxFiles,
  maxSize,
  className,
}: InnerProps<T>) {
  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      await new Promise((r) => setTimeout(r, 400));

      const isImage = file.type.startsWith("image/");
      return {
        status: "success",
        result: isImage ? URL.createObjectURL(file) : null,
      };
    },
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        "application/vnd.ms-powerpoint": [".ppt"],
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
      },
      maxFiles,
      maxSize: maxSize * 1024 * 1024,
    },
  });

  /* ------------------------------------------------------------
     Sync dropzone files → react-hook-form
  ------------------------------------------------------------ */

  React.useEffect(() => {
    field.onChange(dropzone.fileStatuses.map((f) => f.file));
  }, [dropzone.fileStatuses, field]);

  /* ------------------------------------------------------------
     Cleanup preview URLs
  ------------------------------------------------------------ */

  React.useEffect(() => {
    return () => {
      dropzone.fileStatuses.forEach((f) => {
        if (typeof f.result === "string") {
          URL.revokeObjectURL(f.result);
        }
      });
    };
  }, []);

  return (
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>

      <FormControl>
        <Dropzone {...dropzone}>
          <div className="space-y-2">
            <div className="flex justify-between">
              <DropzoneDescription>
                {description ??
                  `Upload up to ${maxFiles} files (Max ${maxSize}MB each)`}
              </DropzoneDescription>
              <DropzoneMessage />
            </div>

            <DropZoneArea
              className={cn(
                "border-2 border-dashed rounded-lg transition-colors",
                error
                  ? "border-destructive"
                  : "border-muted-foreground hover:border-primary"
              )}
            >
              <DropzoneTrigger className="flex flex-col items-center gap-4 p-10 w-full text-center">
                <CloudUpload className="size-8 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Upload files</p>
                  <p className="text-sm text-muted-foreground">
                    Click or drag & drop
                  </p>
                </div>
              </DropzoneTrigger>
            </DropZoneArea>
          </div>

          <DropzoneFileList className="grid gap-3 mt-4 md:grid-cols-2 lg:grid-cols-3">
            {dropzone.fileStatuses.map((file) => {
              const isImage = file.file.type.startsWith("image/");

              return (
                <DropzoneFileListItem
                  key={file.id}
                  file={file}
                  className="rounded-md bg-secondary p-0 overflow-hidden"
                >
                  {file.status === "pending" && (
                    <div className={cn(
                      "animate-pulse bg-black/20",
                      isImage ? "aspect-video" : "h-24"
                    )} />
                  )}

                  {file.status === "success" && isImage && file.result && (
                    <Image
                      src={file.result}
                      alt={file.fileName}
                      width={300}
                      height={200}
                      className="aspect-video object-cover"
                    />
                  )}

                  {file.status === "success" && !isImage && (
                    <div className="h-24 flex items-center justify-center bg-muted">
                      <FileIcon className="size-12 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex items-center justify-between p-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {file.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <DropzoneRemoveFile size="sm" variant="ghost">
                      <Trash2 className="size-4" />
                    </DropzoneRemoveFile>
                  </div>
                </DropzoneFileListItem>
              );
            })}
          </DropzoneFileList>
        </Dropzone>
      </FormControl>

      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}

export default DropzoneField;
