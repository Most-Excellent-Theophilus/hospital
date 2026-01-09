// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card"
// import { PatientSchema } from "@/lib/firebase/firebase.types"
// import { flexRender, Table } from "@tanstack/react-table"

// export function PatientCards({ table }: { table: Table<PatientSchema>}) {
//   return (
//     <div className="sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//       {table.getRowModel().rows.map((row) => (
//         <div key={row.id} className="border py-4 rounded">
//           <CardHeader>
//             <CardTitle>
//               {flexRender(
//                 row.getVisibleCells()[0].column.columnDef.cell,
//                 row.getVisibleCells()[0].getContext()
//               )}
//             </CardTitle>
//           </CardHeader>

//           <CardContent className="">
//             {row.getVisibleCells().slice(1).map((cell) => (
//               <div
//                 key={cell.id}
//                 className="flex justify-between text-sm"
//               >
//                 <span className="text-muted-foreground">
//                   {flexRender(
//                     cell.column.columnDef.header,
//                     cell.getContext()
//                   )}
//                 </span>
//                 <span className="font-medium">
//                   {flexRender(
//                     cell.column.columnDef.cell,
//                     cell.getContext()
//                   )}
//                 </span>
//               </div>
//             ))}
//           </CardContent>

//           <CardFooter>
//             {/* actions */}
//           </CardFooter>
//         </div>
//       ))}
//     </div>
//   )
// }
