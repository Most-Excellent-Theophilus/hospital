
import { CheckCircle, XCircle } from "lucide-react";


import { capitalizeFirstLetter } from "@/lib/utils";
import { useSharedState } from "@/components/providers/dashboard-context"



import { dateUtils } from "@/lib/utils/date";
import { logoutNow } from "@/features/auth/auth.actions";
import { AddressInfo, InfoField, Section } from "@/components/review-componemts";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
const AccountModule = () => {
  const { value } = useSharedState();



  const logout = () => {
    logoutNow()
  }
  return <div className="w-full max-w-7xl mx-auto p-3 space-y-4  ">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>


        <h1 className="text-xl font-bold leading-tight tracking-wider">
          Dr. {capitalizeFirstLetter(value.firstName)} {value.middleName} {capitalizeFirstLetter(value.lastName)}
        </h1>
      </div>
    </div>
    {/* Compact Grid Layout */}
    <div className="grid grid-cols-1 md:grid-cols-2  gap-4 ">
      {/* Personal Information */}
      <Section title="Personal Information">
        <InfoField label="First Name" value={value.firstName} />
        <InfoField label="Middle Name" value={value.middleName} />
        <InfoField label="Last Name" value={value.lastName} />
        <AddressInfo label="Date Of Birth" value={dateUtils.formatFull(value.dateOfBirth)} />
        <InfoField label="Gender" value={capitalizeFirstLetter(value.gender)} />
        <Separator className="my-2" />
        {value.customGender && <InfoField label="Gender" value={value.customGender} />}

      </Section>

      <Section title="Work Details">
        <InfoField label="Email" value={value.email} />
        <InfoField label="Doctor ID" value={value.doctorId} />
        <InfoField label="Rights" value={capitalizeFirstLetter(value.userType)} />

        <Separator className="my-2" />
        <AddressInfo label="Verified" value={value.verified ? <CheckCircle className="text-primary" /> : <XCircle className="text-destructive" />} />
      </Section>

      <Section title="Location Info">
        <InfoField label="Continent" value={capitalizeFirstLetter(value.continent)} />
        <InfoField label="Region" value={capitalizeFirstLetter(value.region)} />
        <InfoField label="Country" value={capitalizeFirstLetter(value.country)} />
        <InfoField label="City" value={capitalizeFirstLetter(value.city)} />

        <Separator className="my-2" />
        <AddressInfo label="Ip Address" value={value.ip} />
        <InfoField label="Longitude" value={value.lon} />
        <InfoField label="Lat" value={value.lat} />
        <AddressInfo label="Time Zone" value={value.timezone} />

      </Section>


      <Section title="Device Info">
        <InfoField label="OS" value={value.os} />
        <InfoField label="OS version" value={value.osVersion} />
        <InfoField label="Model" value={value.model} />
        <InfoField label="Screen Hieght" value={value.screenHeight} />
        <InfoField label="Screen Width" value={value.screenWidth} />

        <Separator className="my-2" />
        <AddressInfo label="Vendor" value={value.vendor} />
        <InfoField label="Device Type" value={value.deviceType} />
        <InfoField label="Browser Version" value={value.browserVersion} />
        <InfoField label="Browser" value={value.browser} />
        <InfoField label="Host" value={value.host} />
        <InfoField label="Vendor" value={value.vendor} />
        <AddressInfo label="TouchScreen" value={value.isTouch ? <CheckCircle className="text-primary" /> : <XCircle className="text-destructive" />} />
      </Section>

    </div>
    <div className="flex items-center">


      <Button onClick={logout} variant={'destructive'}>Log out</Button>
    </div>

  </div>;
};

export default AccountModule;