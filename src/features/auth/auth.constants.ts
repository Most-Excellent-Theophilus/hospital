import z from "zod";

export const passwordRules = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  { regex: /[0-9]/, text: "At least 1 number" },
  {
    regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
    text: "At least 1 special character",
  },
];

export const passwordSchema = z
  .string()
  .regex(/.{8,}/, "At least 8 characters")
  .regex(/[a-z]/, "At least 1 lowercase letter")
  .regex(/[A-Z]/, "At least 1 uppercase letter")
  .regex(/[0-9]/, "At least 1 number")
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
    "At least 1 special character"
  );