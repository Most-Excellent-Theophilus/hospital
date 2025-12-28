"use client";

import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
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
import { CloudUpload, File, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/index";

type DropzoneFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: React.ReactNode;
  description?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
};

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
      render={({ field, fieldState }) => {
        const dropzone = useDropzone({
          onDropFile: async (file: File) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            
            // Create preview URL for images
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
            maxSize: maxSize * 1024 * 1024,
            maxFiles: maxFiles,
          },
        });

        // Sync dropzone files with form field
        React.useEffect(() => {
          const files = dropzone.fileStatuses.map(f => f.file);
          field.onChange(files);
        }, [dropzone.fileStatuses, field]);

        return (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Dropzone {...dropzone}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <DropzoneDescription>
                      {description || `Upload up to ${maxFiles} files (images and office documents)`}
                    </DropzoneDescription>
                    <DropzoneMessage />
                  </div>
                  <DropZoneArea
                    className={cn(
                      "border-2 border-dashed rounded-lg transition-colors",
                      fieldState.invalid
                        ? "border-destructive"
                        : "border-muted-foreground hover:border-primary"
                    )}
                  >
                    <DropzoneTrigger className="flex flex-col items-center gap-4 bg-transparent p-10 text-center text-sm w-full">
                      <CloudUpload className="size-8 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">Upload files</p>
                        <p className="text-sm text-muted-foreground">
                          Click here or drag and drop to upload
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Images, PDF, Word, Excel, PowerPoint (Max {maxSize}MB per file)
                        </p>
                      </div>
                    </DropzoneTrigger>
                  </DropZoneArea>
                </div>

                <DropzoneFileList className="grid gap-3 p-0 mt-4 md:grid-cols-2 lg:grid-cols-3">
                  {dropzone.fileStatuses.map((file) => {
                    const isImage = file.file.type.startsWith("image/");
                    
                    return (
                      <DropzoneFileListItem
                        className="overflow-hidden rounded-md bg-secondary p-0 shadow-sm"
                        key={file.id}
                        file={file}
                      >
                        {file.status === "pending" && (
                          <div className={cn(
                            "animate-pulse bg-black/20",
                            isImage ? "aspect-video" : "h-24"
                          )} />
                        )}
                        {file.status === "success" && isImage && file.result && (
                          <img
                            src={file.result}
                            alt={`uploaded-${file.fileName}`}
                            className="aspect-video object-cover"
                          />
                        )}
                        {file.status === "success" && !isImage && (
                          <div className="h-24 flex items-center justify-center bg-muted">
                            <File className="size-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex items-center justify-between p-2 pl-4">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{file.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <DropzoneRemoveFile
                            variant="ghost"
                            size="sm"
                            className="shrink-0 hover:bg-destructive/10"
                          >
                            <Trash2 className="size-4" />
                          </DropzoneRemoveFile>
                        </div>
                      </DropzoneFileListItem>
                    );
                  })}
                </DropzoneFileList>
              </Dropzone>
            </FormControl>
            {fieldState.error && (
              <FormMessage className="text-destructive text-xs">
                {fieldState.error.message}
              </FormMessage>
            )}
          </FormItem>
        );
      }}
    />
  );
};

export default DropzoneField;