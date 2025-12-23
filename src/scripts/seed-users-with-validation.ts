// ============================================================================
// FILE: scripts/seed-users-with-validation.ts
// Version with Zod validation to ensure generated data matches schema
// ============================================================================

import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

import z from "zod";

const genders = ["male", "female", "other"] as const;
const userTypes = ["admin", "inputer", "viewer"] as const;

// Extended schema with metadata
const userWithMetaSchema = z.object({
  id: z.string(),
  createdAt: z.string(), // ISO string for JSON
  updatedAt: z.string(), // ISO string for JSON
  firstName: z.string().min(3).max(50),
  middleName: z.string().min(3).max(50).optional(),
  lastName: z.string().min(3).max(50),
  email: z.string().email(),
  dateOfBirth: z.string(), // ISO string for JSON
  gender: z.enum(["male", "female", "other"]),
  userType: z.enum(["admin", "inputer", "viewer"]),
  password: z.string().min(8).max(50),
});

function generateUser() {
  const gender = faker.helpers.arrayElement(genders);
  const firstName = faker.person.firstName(
    gender === "other" ? undefined : gender
  );
  const lastName = faker.person.lastName();

  // Ensure minimum 3 characters for names
  const getValidName = (name: string) => {
    return name.length >= 3 ? name : name + faker.string.alpha(3 - name.length);
  };

  const middleName = faker.datatype.boolean({ probability: 0.3 })
    ? getValidName(faker.person.middleName())
    : undefined;

  const createdAt = faker.date.recent({ days: 730 });
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

  return {
    id: faker.string.uuid(),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    firstName: getValidName(firstName),
    middleName,
    lastName: getValidName(lastName),
    email: faker.internet
      .email({ firstName, lastName })
      .toLowerCase(),
    dateOfBirth: faker.date
      .birthdate({ min: 18, max: 80, mode: "age" })
      .toISOString(),
    gender,
    userType: faker.helpers.arrayElement(userTypes),
    password: faker.internet.password({ length: 12 }),
  };
}

// Generate and validate users
const users = [];
let successCount = 0;
let errorCount = 0;

for (let i = 0; i < 100; i++) {
  try {
    const user = generateUser();
    const validatedUser = userWithMetaSchema.parse(user);
    users.push(validatedUser);
    successCount++;
  } catch (error) {
    errorCount++;
    console.error(`❌ Validation error for user ${i}:`, error);
  }
}

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write to JSON file
fs.writeFileSync(
  path.join(dataDir, "users.json"),
  JSON.stringify(users, null, 2)
);

console.log("✅ Users data generated and validated.");
console.log(`📊 Success: ${successCount} users`);
console.log(`❌ Errors: ${errorCount} users`);
console.log(`📁 File saved to: data/users.json`);