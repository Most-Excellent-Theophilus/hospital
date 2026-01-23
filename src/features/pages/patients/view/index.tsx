import { useQueryState } from "nuqs";
import { usePatientIds,  } from "../patient.queries";
import { Badge } from "@/components/ui/badge";
import { PatientSchema } from "@/lib/firebase/firebase.types";
import PatientViewer from "./patients.view";
import LoadingPage from "@/components/loadingpage";
import { useSharedState } from "@/components/providers/dashboard-context";

const PatientsviewModule = () => {
  const [ids] = useQueryState('id')
 const jsonIds: string[] = JSON.parse(decodeURIComponent(ids || ''))
   const toUrl = jsonIds?.join('/')
   const { value } = useSharedState()
       ;
     const { data } = usePatientIds({ id: toUrl, auth: value.password as string });
   
 

    if (!data) return <LoadingPage />

  const selectedPatients = data?.filter((patient) => ids?.includes(patient.id))

  return <div>
    {selectedPatients?.map((patient, i) => <div className="flex relative" key={i}> <div className=" absolute -left-4 sm:left-0"><Badge className="text-base sm:mt-6 font-bold">{i + 1}</Badge></div> <PatientViewer data={patient as unknown as PatientSchema} /></div>)}


    <div className="pt-20">
<p></p>
    </div>
  </div>
};

export default PatientsviewModule;