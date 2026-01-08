import { useQueryState } from "nuqs";
import { usePatients } from "../patient.queries";
import { useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { PatientSchema } from "@/lib/firebase/firebase.types";
import PatientViewer from "./patients.view";

const PatientsviewModule = () => {
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

  return <div>
    {selectedPatients?.map((patient, i) => <div className="flex relative"> <div className=" absolute -left-4 sm:left-0"><Badge className="text-base sm:mt-6 font-bold">{i + 1}</Badge></div> <PatientViewer data={patient as unknown as PatientSchema} /></div>)}


    <div className="pt-20">
<p></p>
    </div>
  </div>
};

export default PatientsviewModule;