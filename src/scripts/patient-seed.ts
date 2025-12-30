// import { faker } from '@faker-js/faker';

// // Seed for reproducible results (optional)
// faker.seed(123);

// /**
//  * Real open source documents available online
//  */
// const SAMPLE_DOCUMENTS = [
//   // PDF Documents
//   {
//     url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
//     name: 'sample_medical_record.pdf',
//     type: 'application/pdf',
//     size: 13264
//   },
//   {
//     url: 'https://pdfobject.com/pdf/sample.pdf',
//     name: 'patient_consent_form.pdf',
//     type: 'application/pdf',
//     size: 3028
//   },
//   {
//     url: 'https://www.africau.edu/images/default/sample.pdf',
//     name: 'insurance_document.pdf',
//     type: 'application/pdf',
//     size: 3028
//   },
//   // Images
//   {
//     url: 'https://via.placeholder.com/1200x800/0066CC/FFFFFF?text=Insurance+Card+Front',
//     name: 'insurance_card_front.png',
//     type: 'image/png',
//     size: 45678
//   },
//   {
//     url: 'https://via.placeholder.com/1200x800/CC0000/FFFFFF?text=Insurance+Card+Back',
//     name: 'insurance_card_back.png',
//     type: 'image/png',
//     size: 43210
//   },
//   {
//     url: 'https://via.placeholder.com/1200x1600/00CC66/FFFFFF?text=ID+Document',
//     name: 'national_id.jpg',
//     type: 'image/jpeg',
//     size: 89123
//   },
//   {
//     url: 'https://via.placeholder.com/800x600/9933CC/FFFFFF?text=Lab+Results',
//     name: 'lab_results.jpg',
//     type: 'image/jpeg',
//     size: 67890
//   },
//   {
//     url: 'https://via.placeholder.com/1000x1400/FF6600/FFFFFF?text=Prescription',
//     name: 'prescription.png',
//     type: 'image/png',
//     size: 54321
//   },
//   // More varied documents
//   {
//     url: 'https://file-examples.com/storage/fe7f8d34e2a05c94a615673/2017/10/file-sample_150kB.pdf',
//     name: 'vaccination_record.pdf',
//     type: 'application/pdf',
//     size: 142786
//   },
//   {
//     url: 'https://via.placeholder.com/2000x1500/3366CC/FFFFFF?text=X-Ray+Scan',
//     name: 'xray_chest.png',
//     type: 'image/png',
//     size: 234567
//   }
// ];

// /**
//  * Generate document metadata with real URLs
//  */
//  function generateDocument() {
//   const doc = faker.helpers.arrayElement(SAMPLE_DOCUMENTS);
//   const uploadedDate = faker.date.recent({ days: 180 });
//   const fileId = faker.string.uuid();
  
//   return {
//     customId: faker.datatype.boolean(0.7) ? faker.string.uuid() : null,
//     fileHash: faker.string.hexadecimal({ length: 64, prefix: '' }),
//     key: `patients/documents/${faker.string.uuid()}/${doc.name}`,
//     name: doc.name,
//     size: doc.size,
//     type: doc.type,
//     ufsUrl: `https://storage.example.com/uploads/${fileId}/${doc.name}`,
//     lastModified: uploadedDate.getTime(),
//     serverData: {
//       uploadedBy: faker.string.uuid()
//     },
//     url: doc.url, // Real downloadable URL
//     appUrl: `https://app.example.com/files/${fileId}`
//   };
// }

// /**
//  * Generate a single patient record for form submission
//  */
//  function generatePatientFormData() {
//   const gender = faker.helpers.arrayElement(['male', 'female', 'other'] as const);
//   const firstName = faker.person.firstName(gender === 'other' ? undefined : gender);
//   const lastName = faker.person.lastName();
//   const hasMiddleName = faker.datatype.boolean(0.6);
  
//   // Generate 1-3 other contacts
//   const numContacts = faker.number.int({ min: 1, max: 3 });
//   const otherContacts = Array.from({ length: numContacts }, () => {
//     const contactType = faker.helpers.arrayElement(['email', 'phone'] as const);
//     const contactGender = faker.helpers.arrayElement(['male', 'female']);
    
//     return {
//       fullName: faker.person.fullName({ sex: contactGender }),
//       relationship: faker.helpers.arrayElement([
//         'Spouse',
//         'Parent',
//         'Sibling',
//         'Child',
//         'Friend',
//         'Guardian',
//         'Emergency Contact',
//         'Caregiver'
//       ]),
//       type: contactType,
//       contact: contactType === 'email' 
//         ? faker.internet.email()
//         : faker.phone.number({style:"international"}) // Malawi format
//     };
//   });

//   return {
//     firstName,
//     middleName: hasMiddleName ? faker.person.middleName() : "",
//     lastName,
//     email: faker.internet.email({ firstName, lastName }),
//     otherContacts,
//     documents: [], // For form data, documents would be File objects uploaded by user
//     dateOfBirth: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
//     gender,
//     address: faker.location.streetAddress({ useFullAddress: true }) + ', ' + 
//              faker.helpers.arrayElement(['Blantyre', 'Lilongwe', 'Mzuzu', 'Zomba']),
//     phoneNumber: faker.phone.number({style:'international'}),
//     doctorEmail: faker.internet.email({
//       firstName: 'Dr. ' + faker.person.firstName(),
//       lastName: faker.person.lastName(),
//       provider: 'medicalcenter.mw'
//     }),
//     doctorId: faker.string.uuid()
//   };
// }

// /**
//  * Generate patient with metadata (for database records)
//  */
//  function generatePatientWithMeta() {
//   const patient = generatePatientFormData();
//   const createdAt = faker.date.past({ years: 11 });
//   const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
  
//   // Generate 1-5 documents with real URLs
//   const numDocs = faker.number.int({ min: 1, max: 5 });
//   const documents = Array.from({ length: numDocs }, () => generateDocument());
  
//   return {
//     id: faker.string.uuid(),
//     createdAt,
//     updatedAt,
//     firstName: patient.firstName,
//     middleName: patient.middleName,
//     lastName: patient.lastName,
//     email: patient.email,
//     otherContacts: patient.otherContacts,
//     dateOfBirth: patient.dateOfBirth.toISOString().split('T')[0], // YYYY-MM-DD
//     gender: patient.gender,
//     address: patient.address,
//     phoneNumber: patient.phoneNumber,
//     doctorEmail: patient.doctorEmail,
//     doctorId: patient.doctorId,
//     documents
//   };
// }

// /**
//  * Generate multiple patient records with metadata
//  */
// async  function generatePatientsWithMeta(count: number) {
//   return Array.from({ length: count }, () => generatePatientWithMeta());
// }

// /**
//  * Generate seed data for Firebase/Firestore
//  */
// //  function generateFirestoreSeedData(count: number) {
// //   const patients = generatePatientsWithMeta(count);
  
// //   // Format for Firestore import
// //   return patients.reduce((acc, patient) => {
// //     acc[patient.id] = {
// //       ...patient,
// //       createdAt: patient.createdAt,
// //       updatedAt: patient.updatedAt
// //     };
// //     return acc;
// //   }, {} as Record<string, any>);
// // }

// /**
//  * Generate JSON file for seeding
//  */


// // Example usage:
// console.log('=== Patient with Real Document URLs ===');
// const patientWithMeta = generatePatientWithMeta();
// console.log(JSON.stringify(patientWithMeta, null, 2));

// console.log('\n=== Generate 50 Patients ===');
// const patients = generatePatientsWithMeta(50);
// // console.log(`✅ Generated ${patients.length} patients with real document URLs`);

// // Example: Export to JSON for seeding
// // exportToJSON(100, 'patients-seed-data.json');

// // Export  functions
// export {
//   generatePatientFormData,
//   generatePatientWithMeta,
//   generatePatientsWithMeta,
// //   generateFirestoreSeedData,

//   generateDocument,
//   SAMPLE_DOCUMENTS
// };