import { useQueryState } from "nuqs";

import { Badge } from "@/components/ui/badge";
import {  UserSchema } from "@/lib/firebase/firebase.types";
import { useUsers } from "../users.queries";
import DoctorViewer from "./doctor.viewer";
import LoadingPage from "@/components/loadingpage";


const PatientsviewModule = () => {
  const [ids] = useQueryState('id')
    const { data } = useUsers();
  

  if (!data) return <LoadingPage />

  const selectedPatients = data?.filter((patient) => ids?.includes(patient.id))

  return <div>
    {selectedPatients?.map((patient, i) => <div className="flex relative" key={i}> <div className=" absolute -left-4 sm:left-0"><Badge className="text-base sm:mt-6 font-bold">{i + 1}</Badge></div> <DoctorViewer  data={patient as unknown as UserSchema} /></div>)}


    <div className="pt-20">
<p></p>
    </div>
  </div>
};

export default PatientsviewModule;