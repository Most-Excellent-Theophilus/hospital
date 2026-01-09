"use client"
import { Button } from "@/components/ui/button";

import { } from "@/components/ui/command"
import { FaCalendarPlus } from "react-icons/fa6";
import { PatientCommand } from "./patient-command";
const Pre_operationModule = () => {

  return <div> <div className="flex space-x-2"> <PatientCommand />  <Button variant={'secondary'} size={'lg'}><FaCalendarPlus />Move to Post Opp </Button></div> 
  
  </div>;
};

export default Pre_operationModule;