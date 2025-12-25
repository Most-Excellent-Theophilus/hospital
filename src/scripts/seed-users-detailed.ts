// // ============================================================================
// // FILE: scripts/seed-users-detailed.ts
// // Alternative version with more realistic data and distributions
// // ============================================================================

// import fs from "fs";
// import path from "path";
// import { faker } from "@faker-js/faker";

// const genders = ["male", "female", "other"] as const;
// const userTypes = ["admin", "inputer", "viewer"] as const;

// // Weighted distribution for user types (more viewers than admins)
// function getWeightedUserType(): typeof userTypes[number] {
//   const rand = Math.random();
//   if (rand < 0.05) return "admin"; // 5% admins
//   if (rand < 0.35) return "inputer"; // 30% inputers
//   return "viewer"; // 65% viewers
// }

// // Generate more realistic dates
// function generateTimestamps() {
//   const createdAt = faker.date.between({
//     from: new Date(2022, 0, 1),
//     to: new Date(),
//   });

//   // Updated date is always after created date
//   const updatedAt = faker.date.between({
//     from: createdAt,
//     to: new Date(),
//   });

//   return { createdAt, updatedAt };
// }

// const users = Array.from({ length: 100 }, (_, index) => {
//   const gender = faker.helpers.arrayElement(genders);
//   const firstName = faker.person.firstName(
//     gender === "other" ? undefined : gender
//   );
//   const lastName = faker.person.lastName();

//   // 30% chance of having a middle name
//   const middleName = faker.datatype.boolean({ probability: 0.3 })
//     ? faker.person.middleName()
//     : undefined;

//   const { createdAt, updatedAt } = generateTimestamps();

//   // Generate email using first and last name for consistency
//   const emailProvider = faker.helpers.arrayElement([
//     "gmail.com",
//     "yahoo.com",
//     "outlook.com",
//     "hotmail.com",
//     "icloud.com",
//   ]);

//   const email = faker.internet
//     .email({
//       firstName,
//       lastName,
//       provider: emailProvider,
//     })
//     .toLowerCase();

//   return {
//     id: faker.string.uuid(),
//     createdAt: createdAt.toISOString(),
//     updatedAt: updatedAt.toISOString(),
//     firstName,
//     middleName,
//     lastName,
//     email,
//     dateOfBirth: faker.date
//       .birthdate({
//         min: 18,
//         max: 80,
//         mode: "age",
//       })
//       .toISOString(),
//     gender,
//     userType: getWeightedUserType(),
//     password: faker.internet.password({
//       length: faker.number.int({ min: 12, max: 20 }),
//       memorable: false,
//       pattern: /[A-Za-z0-9!@#$%^&*]/,
//     }),
//   };
// });

// // Create data directory if it doesn't exist
// const dataDir = path.join(__dirname, "../data");
// if (!fs.existsSync(dataDir)) {
//   fs.mkdirSync(dataDir, { recursive: true });
// }

// // Write to JSON file
// fs.writeFileSync(
//   path.join(dataDir, "users.json"),
//   JSON.stringify(users, null, 2)
// );

// // Generate statistics
// const stats = {
//   total: users.length,
//   byUserType: {
//     admin: users.filter((u) => u.userType === "admin").length,
//     inputer: users.filter((u) => u.userType === "inputer").length,
//     viewer: users.filter((u) => u.userType === "viewer").length,
//   },
//   byGender: {
//     male: users.filter((u) => u.gender === "male").length,
//     female: users.filter((u) => u.gender === "female").length,
//     other: users.filter((u) => u.gender === "other").length,
//   },
//   withMiddleName: users.filter((u) => u.middleName).length,
// };

// console.log("✅ Users data generated.");
// console.log(`📊 Statistics:`);
// console.log(`   Total users: ${stats.total}`);
// console.log(`   Admins: ${stats.byUserType.admin}`);
// console.log(`   Inputers: ${stats.byUserType.inputer}`);
// console.log(`   Viewers: ${stats.byUserType.viewer}`);
// console.log(`   Male: ${stats.byGender.male}`);
// console.log(`   Female: ${stats.byGender.female}`);
// console.log(`   Other: ${stats.byGender.other}`);
// console.log(`   With middle name: ${stats.withMiddleName}`);
// console.log(`📁 File saved to: data/users.json`);