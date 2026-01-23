import { useQueryState } from "nuqs";
import { usePatientIds } from "../patient.queries";
import { Badge } from "@/components/ui/badge";
import { PatientSchema } from "@/lib/firebase/firebase.types";
import PatientViewer from "../view/patients.view";
import LoadingPage from "@/components/loadingpage";
import { Button } from "@/components/ui/button";
import { deletePatients } from "../patient.actions";
import { toast } from "sonner";
import { AlertDescription } from "@/components/ui/alert";
import { useSharedState } from "@/components/providers/dashboard-context";


const PatientsviewModule = () => {
  const [ids] = useQueryState('id')

  const jsonIds: string[] = JSON.parse(decodeURIComponent(ids || ''))
  const toUrl = jsonIds?.join('/')
  const { value } = useSharedState()
    ;
  const { data } = usePatientIds({ id: toUrl, auth: value.password as string });



  if (!data) return <LoadingPage />

  return <div>
    <div className="flex justify-baseline">

      <h1 className="font-bold text-xl pt-5  text-secondary-foreground ">Deleting {data?.length} </h1>

    </div>

    {(!data.length ? [data] : data).map((patient, i) => <div className="flex relative" key={i}>
      <div className=" absolute -left-4 ">
        <Badge className="text-base sm:mt-6 font-bold">{i + 1}</Badge>
      </div>
      <PatientViewer data={patient as unknown as PatientSchema} deletee /></div>)}

    <Button className="w-full" size={'lg'} onClick={() => {
      const id = toast.loading('Please Wait...')
      deletePatients(data.map(p => p.id)).then((res) => {
        if (res.success) {
          toast.success(`Deleted ${res.processedCount} Records`, { id })
        } else {
          toast.error(`Something Went Wrong!`, {
            id,
            description: <AlertDescription >
              <ul>
                {res.errors?.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </AlertDescription>
          })

        }
      }).catch((er) => toast.error(er?.message || "")).finally(() => {
        setTimeout(() => {
          toast.dismiss(id)
        }, 3000)
      })
    }} variant={'destructive'} >Delete All </Button>
    <div className="pt-20">
    </div>
  </div>
};

export default PatientsviewModule;