"use client";


import { Button, buttonVariants } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFieldArray, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import TextInput from "@/components/form/auth/inputs/text-input";
import { DropDownDatePicker } from "@/components/form/auth/inputs/date-input";
import { RadioGroupField } from "@/components/form/auth/inputs/gender";
import EmailUserNameInput from "@/components/form/auth/inputs/email-username";


import { toast } from "sonner";

import { Alerter } from "@/components/form/auth/feedback/alerter";
import { useEffect, useState, useTransition } from "react";
import { toDate } from "@/lib/utils/date";



import { patientSchema, PatientSchema } from "@/features/pages/patients/patient.types";
import { useSharedState } from "@/components/providers/dashboard-context";
import { PatientSchema as Pt } from "@/lib/firebase/firebase.types"

import { useCreatePatient } from "@/features/pages/patients/patient.mutations";
import AddressInput from "@/components/form/auth/inputs/address-input";
import PhoneInputField from "@/components/form/auth/inputs/phone-input";
import DropzoneField from "@/components/form/auth/inputs/file-uploader";
import { Download, ExternalLink, Mail, Phone, Trash2, User } from "lucide-react";
import { CommandSelectField } from "@/components/form/auth/inputs/command-input";
import { Label } from "@/components/ui/label";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { uploadMultipleFiles } from "@/hooks/useSingleFileUpload";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { Section } from "@/components/review-componemts";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const alertMap: Record<"email-not-found" | "email-taken" | 'failed-to-update' | 'success' | "not-allowed", { title: string, message?: string, variant?: "default" | "destructive" | null | undefined }> = {
  "email-not-found": {
    title: 'Email Not Allowed',
    variant: 'destructive',
  }
  ,
  "email-taken": {
    variant: 'destructive',
    title: 'Email is taken'
  },
  "success": {
    variant: 'default',
    title: 'Updated Succefully'
  },
  "failed-to-update": {
    variant: 'destructive',
    title: 'Unable to Update'
  },
  "not-allowed": {
    title: 'Disabled',
    message: 'You do not have the rights to create or update a patient',
    variant: 'destructive'
  }

}
const controller = new AbortController();

export default function CreatePatientPage({ data, }: { data?: PatientSchema | null, }) {
  const createUser = useCreatePatient()
  const toUpdate: Pt = data as unknown as Pt
  const [isPending, startTransition] = useTransition()
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const { value: userSession } = useSharedState()
  const [status, setStatus] = useQueryState('stat')
  const router = useRouter()
  const form = useForm<PatientSchema>({
    resolver: zodResolver(patientSchema),
    defaultValues: data || {
      firstName: "",
      lastName: "",
      email: "",
      middleName: '',
      dateOfBirth: undefined,
      address: '',
      // gender: 'other',
      otherContacts: [{
        contact: '',
        fullName: '',
        
        type: 'phone'
      }],
      phoneNumber: '',
      documents: [],
      doctorEmail: userSession.email,
      doctorId: userSession.doctorId,


    },
  });
  const { append: appendContact, remove: removeContact, fields: contactFields, } = useFieldArray({ control: form.control, name: "otherContacts" })

  const addContact = (type: 'email' | 'phone') => {
    appendContact({ contact: '', fullName: '', relationship: '', type })
  }


  const onSubmit = (dataT: PatientSchema) => {
    const id = toast.loading(`Please wait ${uploadProgress}...  `)
    startTransition(() => {

      uploadMultipleFiles({
        files: dataT.documents,
        options: {
          abortSignal: controller.signal,
          onProgress: ({ progress }) => {
            setUploadProgress(progress);
          },
        },
      }).then((data) => {


        toast.loading(`Uploading Patient info  `, { id })
        createUser.mutate({
          ...dataT, documents: data,
          dateOfBirth: dataT.dateOfBirth.toISOString()
        } as Pt, {
          onSuccess: (value) => {
            const { status, message } = value

            toast[status](message, { id })
            toast.success("Record created")
            setStatus("success")

            toast.loading('Redirecting ...')
            setTimeout(() => {
              router.replace('/dashboard/patients')
            }, 3000)
          },
          onError: () => {
            toast.error("Something went wrong", { id })
          },
          onSettled: () => {
            toast.dismiss(id)

          },
        })
      })



    })

  }
  useEffect(() => {
    const fn = () => {
      if (userSession.userType == 'viewer') {
        setStatus('not-allowed')
      }
    }
    fn()
  })
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full items-center justify-center flex px-7   mt-8 mb-20"
      >
        <fieldset disabled={form.formState.isSubmitting || isPending || userSession.userType == 'viewer'}>
          <div>
            <div className="flex items-center space-x-2.5">

              <h1 className="text-xl font-semibold text-primary">
                {toUpdate ? "Update" : "Create"} Patient {toUpdate && `: ${toUpdate.firstName} ${toUpdate.lastName}`}
              </h1>
            </div>

            <div className="mt-2.5 text-muted-foreground">
              <h3 className="text-sm">{toUpdate ? "Update Fields" : "Get started"}</h3>
            </div>
          </div>

          {/* Grid layout */}
          {status && <Alerter {...alertMap[status as "email-not-found" | "email-taken"]} />}

          <div className="mt-6 mb-7 grid sm:grid-cols-2 gap-6 ">
            <div className="space-y-3 flex flex-col ">
              <div className="flex space-x-3">
                <TextInput
                  control={form.control}
                  label="Patient's First Name"
                  name="firstName"
                  className="bg-accent/20"
                />

                <TextInput
                  control={form.control}
                  label="Patient's Last Name"
                  name="lastName"
                  className="bg-accent/20"
                />
              </div>
              <TextInput
                control={form.control}
                label="Patient's Middle Name"
                name="middleName"
                className="bg-accent/20"
              />


              <DropDownDatePicker
                control={form.control}
                label="Patient's BirthDay"
                name="dateOfBirth"
                def={toUpdate?.dateOfBirth ? {
                  year: toDate(toUpdate.dateOfBirth)?.getFullYear() || 2007,
                  month: toDate(toUpdate.dateOfBirth)?.getMonth() || 1,
                  day: toDate(toUpdate.dateOfBirth)?.getDay() || 1,
                } : null}
                from={0}

              />
            </div>

            <div className="space-y-3 flex flex-col ">

              <EmailUserNameInput
                control={form.control}
                label="Patient's Email"
                name="email"
                className="bg-accent/20"
              />
              <PhoneInputField control={form.control} label="Phone Number" name="phoneNumber" />



              <RadioGroupField<typeof patientSchema>
                layout="row"
                label="Patient's Gender"
                name="gender"
                control={form.control}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
              />


            </div>

          </div>
          <div className="my-4 ">
            <div className="grid sm:grid-cols-2 gap-6 my-3">
              <div className="my-3 ">
                <Label className="mb-3 text-sm text-gray-500">Other Contacts</Label>
                <AddressInput control={form.control} label="Patient's Address" name="address" className="bg-accent/20 h-28 " /></div>


              {contactFields.map((contactField, id) => (<div key={id} className="relative space-y-4  my-3">
                {contactFields.length > 1 && <Button type="button" onClick={() => removeContact(id)} variant={'outline'} size={'icon'} className="hover:bg-destructive  hover:text-background absolute right-0.5 top-0.5 z-50"> <Trash2 /> </Button >}
                <CommandSelectField<typeof patientSchema>
                  control={form.control}
                  name={`otherContacts.${id}.relationship`}
                  label="Relation Ship"
                  placeholder="RelationShip"

                  options={[
                    { value: "guardian", label: "Guardian", icon: <User /> },
                    { value: "mother", label: "Mother", icon: <User /> },
                    { value: "father", label: "Father", icon: <User /> },
                    { value: "friend", label: "Friend", icon: <User /> },
                    { value: "other", label: "Other", icon: <User /> },
                  ]}
                />
                <TextInput
                  control={form.control}
                  label={`${capitalizeFirstLetter(form.watch(`otherContacts.${id}.relationship`))} Full Name`}
                  name={`otherContacts.${id}.fullName`}
                  className="bg-accent/20"
                />

                {contactField.type == 'email' ? <EmailUserNameInput
                  control={form.control}
                  label={`${form.watch(`otherContacts.${id}.fullName`)}'s Email`}
                  name={`otherContacts.${id}.contact`}
                  className="bg-accent/20"
                /> : <PhoneInputField control={form.control} label name={`otherContacts.${id}.contact`} />}



              </div>))}




            </div>
            <div className="flex items-center  space-x-5"><Button disabled={contactFields.length >= 8} type="button" variant={'outline'} size={'lg'} onClick={() => addContact('phone')}><Phone />Add Phone </Button>
              <Button variant={'outline'} type="button" disabled={contactFields.length >= 8} size={'lg'} onClick={() => addContact('email')}><Mail />Add Email</Button> <p className="text-primary/70 text-sm " > Can Add Up to 8 contacts </p></div>


          </div>
          <div className="my-4">
            {/* File Uploader  */}

            {toUpdate?.documents && toUpdate.documents.length > 0 && <Section title={`Supporting Documents (${toUpdate.documents.length})`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {toUpdate.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded bg-muted/30 flex flex-col"
                  >
                    <div className="flex-1 mb-1.5">
                      <p className="font-medium text-sm mb-1">
                        {doc.name || `Document ${index + 1}`}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {doc.size}
                      </Badge>
                    </div>
                    {doc.type.startsWith('image')&& <Image src={`/api/image?url=${encodeURIComponent(doc.ufsUrl)}`} alt="" width={300}  height={200}/>}
                    <div className="flex items-center justify-between mt-4">
                      <Button size={'sm'} variant={'link'} className="text-xs"><Download />Download</Button>
                      <a
                        href={doc.ufsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({variant:"ghost"}), 'text-xs')}
                      >
                        View Document <ExternalLink className="w-3 h-3" />
                      </a></div>


                  </div>
                ))}
              </div>
            </Section>}
            {<div>
           
            </div>}
            {!toUpdate && <DropzoneField control={form.control} label="Supporting Documents" name="documents" maxSize={1} maxFiles={12} />}
          </div>
          <div className="flex justify-between">
            <Button type="button" size="lg" variant={'secondary'} onClick={() => form.reset()}>
              Clear
            </Button>
            <Button type="submit" size="lg" className=" ">
              {toUpdate ? "Update" : "Create"} Patient
            </Button>
          </div>


        </fieldset>
      </form>
    </Form>
  );
}