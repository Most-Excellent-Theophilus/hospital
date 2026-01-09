import { useQueryState } from "nuqs";




import { Badge } from "@/components/ui/badge";

import { useUsers } from "../users.queries";
import { UserSchema } from "@/lib/firebase/firebase.types";
import CreateAccountPage from "../create";
import LoadingPage from "@/components/loadingpage";


const PatientsupdateModule = () => {
  const [ids] = useQueryState('id')
  const { data } = useUsers();

  if (!data) return <LoadingPage />


  const selectedPatients = data?.filter((patient) => ids?.includes(patient.id))
  return (
    <div>
      {selectedPatients?.map((patient, i) => <div key={i} className="flex"> <div className=""><Badge className="text-base mt-8 font-bold">{i + 1}.</Badge></div> <CreateAccountPage data={patient as unknown as UserSchema} /></div>)}
    </div>
  );


};

export default PatientsupdateModule;