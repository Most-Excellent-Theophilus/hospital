"use client"
import { AddressInfo, InfoField, Section } from "@/components/review-componemts";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PatientSchema } from "@/lib/firebase/firebase.types";

import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { dateUtils } from "@/lib/utils/date";
import { Download, ExternalLink,  } from "lucide-react";

import Image from "next/image"
import { deletePatient } from "../patient.actions";
import { useState } from "react";
import { toast } from "sonner";


const PatientViewer = ({ data, deletee, }: { data: PatientSchema, deletee?: boolean, }) => {
    const [deleted, setDeleted] = useState<boolean>(false)
    const {

        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        email,
        address,
        doctorEmail,
        phoneNumber,
        doctorId,
        documents,
        id: i,
        otherContacts,
        updatedAt,
        createdAt,

    } = data


    const onDelete = () => {
        const id = toast.loading('Please Wait..')
        deletePatient(i).then((da) => {
            toast[da.status](da.message, { duration: Infinity, dismissible: true, id })

            if (da.status == 'success') {
                setDeleted(true)

            } else (
                setDeleted(false)
            )
        }).catch(() => setDeleted(false)).finally(() => {
            setTimeout(() => {
                toast.dismiss()
            }, 3000)
        })
    }
    return (<div className={cn("w-full max-w-7xl m-1 p-1 sm:m-3 border sm:p-3 space-y-4 ", deleted && "hidden")}>



        <h1 className="text-base font-semibold   p-1 tracking-wider">
            {capitalizeFirstLetter(firstName)} {middleName} {capitalizeFirstLetter(lastName)}
        </h1>


        {/* Compact Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
            {/* Personal Information */}
            <Section title="Personal Information">
                <InfoField label="First Name" value={firstName} />
                <InfoField label="Middle Name" value={middleName} />
                <InfoField label="Last Name" value={lastName} />
                <InfoField label="Gender" value={capitalizeFirstLetter(gender)} />
                <InfoField label="Age" value={dateUtils.timeAgo(dateOfBirth).slice(0, 3)} />
                <AddressInfo label="Date Of Birth" value={dateUtils.formatFull(dateOfBirth)} />
                <AddressInfo label="Patients Address" value={address} />

                <InfoField label="Email" value={<a href={`mailto:${email}`} className={'text-xs hover:underline'}>{email}</a>} />
                <InfoField label="Phone Number" value={<a href={`tel:${phoneNumber}`} className={'text-xs hover:underline'}>{phoneNumber}</a>} />
                <InfoField label="Patient ID" value={i} />
                <Separator className="my-2" />

            </Section>

            <Section title="Created By">
                <InfoField label="Doctor ID" value={doctorId} />
                <InfoField label="Doctor Email" value={<a href={`mailto:${doctorEmail}`} className={'text-xs hover:underline'}>{doctorEmail}</a>} />



                <Separator className="my-2" />
                <AddressInfo label="Date Created" value={dateUtils.formatFull(createdAt)} />
                <AddressInfo label="Last Update" value={dateUtils.formatFull(updatedAt)} />


            </Section>




        </div>
        <Section title="Other Contacts" className="grid grid-cols-1 md:grid-cols-2  gap-4">

            {otherContacts.map((c, key) => <Section key={key} title={c.fullName} >

                <InfoField label="Relationship" value={c.relationship} />
                <InfoField label={capitalizeFirstLetter(c.type)} value={<a href={` ${c.type == 'email' ? 'mailto:' : 'tel:'} ${c.contact}`} className={'text-xs hover:underline'}>{c.contact}</a>} />

            </Section>)}


        </Section>
        <div className="flex items-center">
            {documents && documents.length > 0 && <Section title={`Supporting Documents (${documents.length})`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc, index) => (
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
                            {doc.type.startsWith('image') && <Image src={`/api/image?url=${encodeURIComponent(doc.ufsUrl)}`} alt="" width={300} height={200} />}
                            <div className="flex items-center justify-between mt-4">
                                <Button size={'sm'} variant={'link'} className="text-xs"><Download />Download</Button>
                                <a
                                    href={doc.ufsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(buttonVariants({ variant: "ghost" }), 'text-xs')}
                                >
                                    View Document <ExternalLink className="w-3 h-3" />
                                </a></div>


                        </div>
                    ))}
                </div>
            </Section>}


        </div>
        {deletee && <Button onClick={onDelete} variant={'destructive'}> Delete</Button>}

    </div>);
}

export default PatientViewer;