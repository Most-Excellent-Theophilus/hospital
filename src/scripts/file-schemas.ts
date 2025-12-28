// import * as z from "zod";

// // Basic: At least one file required
// const basicSchema = z.object({
//   documents: z
//     .array(z.instanceof(File))
//     .min(1, "Please upload at least one file"),
// });

// // Specific number of files
// const exactFilesSchema = z.object({
//   documents: z
//     .array(z.instanceof(File))
//     .min(1, "At least one file is required")
//     .max(5, "Maximum 5 files allowed"),
// });

// // Optional files
// const optionalSchema = z.object({
//   documents: z.array(z.instanceof(File)).optional(),
// });

// // With file type validation
// const typeValidationSchema = z.object({
//   documents: z
//     .array(z.instanceof(File))
//     .min(1, "Please upload at least one file")
//     .refine(
//       (files) => 
//         files.every((file) => 
//           file.type.startsWith("image/") || 
//           file.type === "application/pdf"
//         ),
//       "Only images and PDF files are allowed"
//     ),
// });

// // With file size validation
// const sizeValidationSchema = z.object({
//   documents: z
//     .array(z.instanceof(File))
//     .min(1, "Please upload at least one file")
//     .refine(
//       (files) => files.every((file) => file.size <= 10 * 1024 * 1024),
//       "Each file must be less than 10MB"
//     ),
// });

// // Complete validation (recommended)
// const completeSchema = z.object({
//   documents: z
//     .array(z.instanceof(File))
//     .min(1, "Please upload at least one file")
//     .max(10, "Maximum 10 files allowed")
//     .refine(
//       (files) => files.every((file) => file.size <= 10 * 1024 * 1024),
//       "Each file must be less than 10MB"
//     )
//     .refine(
//       (files) =>
//         files.every((file) => {
//           const validTypes = [
//             "image/png",
//             "image/jpeg",
//             "image/jpg",
//             "image/gif",
//             "image/webp",
//             "application/pdf",
//             "application/msword",
//             "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//             "application/vnd.ms-excel",
//             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//           ];
//           return validTypes.includes(file.type);
//         }),
//       "Only images, PDF, Word, and Excel files are allowed"
//     ),
// });

// // Multiple file fields in one form
// const multipleFieldsSchema = z.object({
//   profileImage: z
//     .array(z.instanceof(File))
//     .min(1, "Profile image is required")
//     .max(1, "Only one profile image allowed")
//     .refine(
//       (files) => files[0]?.type.startsWith("image/"),
//       "Must be an image file"
//     ),
//   supportingDocuments: z
//     .array(z.instanceof(File))
//     .max(5, "Maximum 5 supporting documents")
//     .optional(),
//   certificates: z
//     .array(z.instanceof(File))
//     .min(1, "At least one certificate is required"),
// });