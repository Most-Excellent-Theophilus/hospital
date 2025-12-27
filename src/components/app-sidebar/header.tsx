"use client"
import { SidebarTrigger } from "../ui/sidebar";

import { Button } from "@/components/ui/button"
import {
  DashBoardLinksType,
  linksIconMap,
} from "@/components/app-sidebar/config";
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";


import { capitalizeFirstLetter } from "@/lib/utils";

import {
  Dialog,

  DialogContent,

  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useNavigationVariables } from "@/hooks/url-hooks";

import { AddressInfo, InfoField, Section } from "../review-componemts";
import { Separator } from "../ui/separator";
import { dateUtils } from "@/lib/utils/date";
import { logoutNow } from "@/features/auth/auth.actions";
import { useSharedState } from "@/components/providers/dashboard-context"
const DashBoardHeader = () => {

  const { value: { browser, browserVersion, city, continent, country, dateOfBirth, deviceType, doctorId, email, firstName, gender, host, ip, isTouch, lastName, lat, lon, model, os, osVersion, region, screenHeight, screenWidth, timezone, userType, vendor, customGender, middleName, verified } } = useSharedState();


  const { page } = useNavigationVariables()


  const router = useRouter()
  const { icon: Icon, name: title } = linksIconMap[page as DashBoardLinksType] || linksIconMap['home'];
  const logout = () => {
    logoutNow()
  }
  return (
    <header className="flex justify-between h-16 px-5 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex space-x-2 items-center">
        <SidebarTrigger className="sm:hidden" />
        <Button onClick={() => router.back()} variant={'outline'} size="icon" className="rounded-full"> <ArrowLeft />  </Button>

        <Icon className="size-7 text-primary" />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex flex-row-reverse">   <Dialog>

        <DialogTrigger asChild>
          <Button variant="link">Dr. {capitalizeFirstLetter(firstName)}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[825px]  ">
          <DialogHeader className="hidden">
            <DialogTitle>Edit profile</DialogTitle>

          </DialogHeader>

          <div className="w-full max-w-7xl mx-auto p-3 space-y-4  ">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>


                <h1 className="text-xl font-bold leading-tight tracking-wider">
                  Dr. {capitalizeFirstLetter(firstName)} {middleName} {capitalizeFirstLetter(lastName)}
                </h1>
              </div>
            </div>
            {/* Compact Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4 max-h-[70vh] overflow-y-auto border">
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
                <AddressInfo label="Verified" value={verified ? <CheckCircle className="text-primary" /> : <XCircle className="text-destructive" />} />
              </Section>

              <Section title="Location Info">
                <InfoField label="Continent" value={capitalizeFirstLetter(continent)} />
                <InfoField label="Region" value={capitalizeFirstLetter(region)} />
                <InfoField label="Country" value={capitalizeFirstLetter(country)} />
                <InfoField label="City" value={capitalizeFirstLetter(city)} />

                <Separator className="my-2" />
                <AddressInfo label="Ip Address" value={ip} />
                <InfoField label="Longitude" value={lon} />
                <InfoField label="Lat" value={lat} />
                <AddressInfo label="Time Zone" value={timezone} />

              </Section>


              <Section title="Device Info">
                <InfoField label="OS" value={os} />
                <InfoField label="OS version" value={osVersion} />
                <InfoField label="Model" value={model} />
                <InfoField label="Screen Hieght" value={screenHeight} />
                <InfoField label="Screen Width" value={screenWidth} />

                <Separator className="my-2" />
                <AddressInfo label="Vendor" value={vendor} />
                <InfoField label="Device Type" value={deviceType} />
                <InfoField label="Browser Version" value={browserVersion} />
                <InfoField label="Browser" value={browser} />
                <InfoField label="Host" value={host} />
                <InfoField label="Vendor" value={vendor} />
                <AddressInfo label="TouchScreen" value={isTouch ? <CheckCircle className="text-primary" /> : <XCircle className="text-destructive" />} />
              </Section>

            </div>
            <div className="flex items-center">


              <Button onClick={logout} variant={'destructive'}>Log out</Button>
            </div>

          </div>
        </DialogContent>

      </Dialog></div>
    </header>
  );
};

export default DashBoardHeader;
