
import { AddressInfo, InfoField, Section } from "@/components/review-componemts";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PatientSchema as UserSchema } from "@/lib/firebase/firebase.types";

import { capitalizeFirstLetter } from "@/lib/utils";
import { dateUtils } from "@/lib/utils/date";




const PatientViewer = ({ data, deletee, onChange }: { data: UserSchema, deletee?: boolean, onChange: (value: boolean) => void }) => {

    const {

        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        email,

        updatedAt,
        createdAt,
        userSession
    } = data


    const onDelete = () => {

    }
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

            </Section>

            <Section title="Work Details">
                <InfoField label="Email" value={email} />
                <InfoField label="Doctor ID" value={userSession.doctorId} />

                <Separator className="my-2" />
                <AddressInfo label="Date Created" value={dateUtils.formatFull(createdAt)} />
                <AddressInfo label="Last Update" value={dateUtils.formatFull(updatedAt)} />


            </Section>




        </div>
        <div className="flex items-center">

            {deletee && <Button onClick={onDelete} variant={'destructive'}> Delete</Button>}
            <Button onClick={() => onChange(false)}>Close</Button>
        </div>

    </div>);
}

export default PatientViewer;