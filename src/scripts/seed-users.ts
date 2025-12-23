// ============================================================================
// FILE: scripts/seed-users.ts
// Generate fake user data using faker-js
// ============================================================================

import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

// Match your schema enums
const genders = ["male", "female", "other"] as const;
const userTypes = ["admin", "inputer", "viewer"] as const;

// Helper to generate a random date in the past
function generateBirthDate() {
  return faker.date.birthdate({
    min: 18,
    max: 80,
    mode: "age",
  });
}

// Helper to generate a realistic password
function generatePassword() {
  // Generate a password that meets the 8-50 character requirement
  return faker.internet.password({
    length: faker.number.int({ min: 8, max: 20 }),
    memorable: false,
    pattern: /[A-Za-z0-9!@#$%^&*]/,
  });
}

// Generate random date within the last 2 years for createdAt/updatedAt
function generateRecentDate() {
  return faker.date.recent({ days: 730 }); // Last 2 years
}

// Generate users with proper typing
const users = Array.from({ length: 100 }, () => {
  const gender = faker.helpers.arrayElement(genders);
  const firstName = faker.person.firstName(gender === "other" ? undefined : gender);
  const lastName = faker.person.lastName();
  const middleName = faker.datatype.boolean({ probability: 0.3 })
    ? faker.person.middleName()
    : undefined;

  const createdAt = generateRecentDate();
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

  return {
    // Required fields from mustHave
    id: faker.string.uuid(),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),

    // User schema fields
    firstName,
    middleName,
    lastName,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    dateOfBirth: generateBirthDate().toISOString(),
    gender,
    userType: faker.helpers.arrayElement(userTypes),
    password: generatePassword(),
  };
});

// Write to JSON file
fs.writeFileSync(
  path.join(__dirname, "../data/users.json"),
  JSON.stringify(users, null, 2)
);

console.log("✅ Users data generated.");
console.log(`📊 Generated ${users.length} users`);
console.log(`📁 File saved to: data/users.json`);





// ============================================================================
// FILE: package.json scripts
// Add these to your package.json
// ============================================================================

/*
{
  "scripts": {
    "seed:users": "tsx scripts/seed-users.ts",
    "seed:users:detailed": "tsx scripts/seed-users-detailed.ts",
    "seed:users:validate": "tsx scripts/seed-users-with-validation.ts"
  }
}
*/

// // ============================================================================
// // FILE: data/index.ts
// // Export generated data for use in your app
// // ============================================================================

// import users from "./users.json";

// export { users };

// export type { UserSchema } from "../lib/schemas/user";

// // ============================================================================
// // USAGE EXAMPLE
// // ============================================================================

// /*
// // 1. Run the seed script
// npm run seed:users

// // 2. Use in your components
// import { users } from "@/data";

// function UsersTable() {
//   return (
//     <GenericDataTable
//       data={users}
//       fields={...}
//       createNewRecordLink="/users/new"
//     />
//   );
// }
// */