import { useQueryState } from "nuqs";

import { useEffect } from "react";


import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useUsers } from "../users.queries";
import { UserSchema } from "@/lib/firebase/firebase.types";
import CreateAccountPage from "../create";


const PatientsupdateModule = () => {
  const [ids] = useQueryState('id')
  const { data } = useUsers();

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
      {selectedPatients?.map((patient, i) => <div className="flex"> <div className=""><Badge className="text-base mt-8 font-bold">{i + 1}.</Badge></div> <CreateAccountPage data={patient as unknown as UserSchema} /></div>)}
    </div>
  );


};

export default PatientsupdateModule;