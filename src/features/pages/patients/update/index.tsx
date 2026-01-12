import { useQueryState } from "nuqs";
import { usePatientIds } from "../patient.queries";

import CreatePatientPage from "../create";
import { PatientSchema } from "../patient.types";
import { Badge } from "@/components/ui/badge";

import LoadingPage from "@/components/loadingpage";


const PatientsupdateModule = () => {
  const [ids] = useQueryState('id')
  const jsonIds: string[] = JSON.parse(decodeURIComponent(ids || ''))
  const toUrl = jsonIds?.join('/')
  const { data } = usePatientIds(toUrl);

  if (!data) return <LoadingPage />


  if (!data.length) {

  } 
  return (
    <div>
      {/* {JSON.stringify({ data })} */}
      {(!data.length ? [data] : data).map((patient, i) => <div className="flex" key={i}> <div className=""><Badge className="text-base mt-8 font-bold">{i + 1}.</Badge></div> <CreatePatientPage data={patient as unknown as PatientSchema} /></div>)}
    </div>
  );


};

export default PatientsupdateModule;