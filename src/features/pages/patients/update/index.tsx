import { useQueryState } from "nuqs";
import { usePatients } from "../patient.queries";
import { useEffect } from "react";

import CreatePatientPage from "../create";
import { PatientSchema } from "../patient.types";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";


const PatientsupdateModule = () => {
  const [ids] = useQueryState('id')
  const { data } = usePatients();

  useEffect(() => {
    if (data) {

      toast.dismiss()
    } else {
      toast.loading('Loading ...')
    }
  })


  const selectedPatients = data?.filter((patient) => ids?.includes(patient.id))
  return (
    <div>
      {selectedPatients?.map((patient, i) => <div className="flex"> <div className=""><Badge className="text-base mt-8 font-bold">{i + 1}.</Badge></div> <CreatePatientPage data={patient as unknown as PatientSchema} /></div>)}
    </div>
  );


};

export default PatientsupdateModule;