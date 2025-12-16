// "use client";

// import LogoIcon from "@/components/logo";
// import z from "zod";
// import { Button } from "@/components/ui/button";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { useForm } from "react-hook-form";
// import { Form } from "@/components/ui/form";

// import EmailUserNameInput from "@/components/form/auth/inputs/email-username";
// import PasswordInput from "./inputs/password";
// import { authSchema } from "@/schema/user";
// import TextInput from "./inputs/text-input";
// import { DropDownDatePicker } from "./inputs/date-input";
// import CreatePasswordInput from "./inputs/create-password";
// import { RadioGroupField } from "./inputs/gender";

// export default function CreateAccountPage() {
//   const form = useForm<z.infer<typeof authSchema>>({
//     resolver: zodResolver(authSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
// customGender:'',  
//       email: "",
//       password: "",
//       passwordRepeat: "",
//       gender: "",
//     },
//   });

//   const onSubmit = () => {};

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="w-full items-center justify-center flex px-7"
//       >
//         <fieldset disabled={form.formState.isSubmitting}>
//           <div>
//             <div className="flex items-center space-x-2.5">
//               <LogoIcon className="size-9 fill-primary" />
//               <h1 className="text-xl font-semibold text-primary">
//                 Create an account
//               </h1>
//             </div>

//             <div className="mt-2.5 text-muted-foreground">
//               <h3 className="text-sm">Get started</h3>
//             </div>
//           </div>
//           {/* <pre
//             className="whitespace-pre-wrap text-sm leading-relaxed"
//             suppressHydrationWarning
//           >{JSON.stringify(form.watch(), null, 2)}</pre> */}

//           {/* Grid layout */}
//           <div className="mt-6 mb-7 grid sm:grid-cols-2 gap-6 ">
//             <div className="space-y-3 flex flex-col justify-between">
//               <div className="space-y-3">
//                 <TextInput
//                   control={form.control}
//                   label="First Name"
//                   name="firstName"
//                   className="bg-accent"
//                 />

//                 <TextInput
//                   control={form.control}
//                   label="Last Name"
//                   name="lastName"
//                   className="bg-accent"
//                 />
//               </div>

//               <DropDownDatePicker
//                 control={form.control}
//                 label="BirthDay"
//                 name="dateOfBirth"
//               />

//               <RadioGroupField<typeof authSchema>
//                 layout="row"
//                 label="Gender"
//                 name="gender"
//                 control={form.control}
//                 options={[
//                   { value: "male", label: "Male" },
//                   { value: "female", label: "Female" },
//                   { value: "custom", label: "Custom" },
//                 ]}
//               />
//               {form.watch("gender") == "custom" && (
//                 <div className="mt-1">
//                   <TextInput
//                     control={form.control}
//                     label="Specify Gender"
//                     name="customGender"
//                     className="bg-accent"
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="space-y-3 flex flex-col justify-between">
//               <div className="space-y-3">
//                 {" "}
//                 <EmailUserNameInput
//                   control={form.control}
//                   label="Email"
//                   name="email"
//                   className="bg-accent"
//                 />
//                 <CreatePasswordInput
//                   control={form.control}
//                   label="Password"
//                   name="password"
//                 />
//               </div>

//               <PasswordInput
//                 control={form.control}
//                 label="Password Repeat"
//                 name="passwordRepeat"
//                 className="bg-accent"
//               />
//             </div>
//           </div>

//           <div>
//             <Button type="submit" size="lg" className="w-full">
//               Create Account
//             </Button>
//           </div>

//           <div className="bg-muted rounded-md border p-3 mt-4">
//             <p className="text-accent-foreground text-center text-sm">
//               Already have an account?
//               <Button asChild variant="link" className="px-2">
//                 <Link href="/login">Login</Link>
//               </Button>
//             </p>
//           </div>
//         </fieldset>
//       </form>
//     </Form>
//   );
// }
