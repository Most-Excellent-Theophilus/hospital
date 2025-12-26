
import { AddressInfo, InfoField, Section } from "@/components/review-componemts";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserSchema } from "@/lib/firebase/firebase.types";
import { capitalizeFirstLetter } from "@/lib/utils";
import { dateUtils } from "@/lib/utils/date";
import {  CheckCircle, XCircle } from "lucide-react";



const DoctorViewer = ({ data, deletee }: { data: UserSchema, deletee?: boolean }) => {

    const { firstName, middleName, lastName, dateOfBirth, gender, email, customGender, doctorId, userType, updatedAt, createdAt, verified } = data
    return (<div className="w-full max-w-7xl mx-auto p-3 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>


                <h1 className="text-xl font-bold leading-tight tracking-wider">
                    Dr. {capitalizeFirstLetter(firstName)} {middleName} {capitalizeFirstLetter(lastName)}
                </h1>
            </div>
        </div>
        {/* Compact Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
            {/* Personal Information */}
            <Section title="Personal Information">
                <InfoField label="First Name" value={firstName} />
                <InfoField label="Middle Name" value={middleName} />
                <InfoField label="Last Name" value={lastName} />
                <AddressInfo label="Date Of Birth" value={dateUtils.formatFull(dateOfBirth)} />
                <InfoField label="Gender" value={capitalizeFirstLetter(gender)} />
                <Separator className="my-2" />
                {customGender && <InfoField label="Gender" value={customGender} />}

            </Section>

            <Section title="Work Details">
                <InfoField label="Email" value={email} />
                <InfoField label="Doctor ID" value={doctorId} />
                <InfoField label="Rights" value={capitalizeFirstLetter(userType)} />

                <Separator className="my-2" />
                <AddressInfo  label="Verified" value={verified ? <CheckCircle className="text-primary" /> : <XCircle className="text-destructive" />} />
                <AddressInfo label="Date Created" value={dateUtils.formatFull(createdAt)} />
                <AddressInfo label="Last Update" value={dateUtils.formatFull(updatedAt)} />


            </Section>




        </div>
        {deletee && <Button variant={'destructive'}> Delete</Button>}

    </div>);
}

export default DoctorViewer;