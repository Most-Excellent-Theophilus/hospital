import { useQueryState } from "nuqs";

import { zodResolver } from "@hookform/resolvers/zod";

import { useFieldArray, useForm, useWatch } from "react-hook-form";


;
import LoadingPage from "@/components/loadingpage";
import { useSharedState } from "@/components/providers/dashboard-context";
import { preOpSchema, PreopSchemaWithoutMeta } from "../preop.types";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import AddressInput from "@/components/form/auth/inputs/address-input";
import TextInput from "@/components/form/auth/inputs/text-input";
import { ArrowDown, ArrowUp, CircleMinus, Plus, Trash2 } from "lucide-react";
import { AddressInfo, InfoField, Section } from "@/components/review-componemts";
import DropzoneField from "@/components/form/auth/inputs/file-uploader";
import { usePatientIds } from "../../patients/patient.queries";
import { PatientSchema, PreopSchema,} from "@/lib/firebase/firebase.types";
import { Badge } from "@/components/ui/badge";
import { createPreOpPatient } from "../preop.actions";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import TextEditor from "@/components/form/auth/inputs/Text-editor";
import { capitalizeFirstLetter } from "@/lib/utils";
import { dateUtils, toDate } from "@/lib/utils/date";
import { SharesAllocationField } from "@/components/form/auth/inputs/input-allocation-field";
import { CommandSelectField } from "@/components/form/auth/inputs/command-input";
import { uploadMultipleFiles } from "@/hooks/useSingleFileUpload";
import { useRouter } from "next/navigation";



const PatientsviewModule = () => {
  const [ids] = useQueryState('id')
  const jsonIds: string[] = JSON.parse(decodeURIComponent(ids || ''))
  const toUrl = jsonIds?.join('/')
  const { value } = useSharedState()

  const { data } = usePatientIds({ id: toUrl, auth: value.password as string });




  if (!data) return <LoadingPage />
  return <div>
    <div className="flex justify-baseline">

      <h1 className="font-bold text-xl pt-5  text-secondary-foreground ">Creating {data?.length} </h1>

    </div>
    {(!data.length ? [data] : data)?.map((pat, i) => <div key={i} className="relative"> <div className=" absolute -left-4 ">
      <Badge className="text-base sm:mt-6 font-bold">{i + 1}</Badge>
    </div>  <PreOpForm data={pat as PatientSchema} /></div>)}
  </div>

};

export default PatientsviewModule;

const controller = new AbortController();
export const PreOpForm = (props: { data: PatientSchema }) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const { value: userSession } = useSharedState()
  const router = useRouter()
  const { email, firstName, gender, lastName, middleName, phoneNumber } = props.data
  const form = useForm<PreopSchemaWithoutMeta>({
    mode: 'onTouched',
    resolver: zodResolver(preOpSchema),
    defaultValues: {
      bloodPressure: 0,
      bmi: 0,
      bsa: '',
      date: new Date(),
      dentalHistory: '',
      diagnosis: '',
      heartRate: 0,
      hF: 0,
      patient: { dateOfBirth: toDate(props.data.dateOfBirth), email, firstName, gender, lastName, middleName, phoneNumber },
      hieght: 0,
      // hospital: 'adventist',
      patientId: props.data.id,
      // riskPriority: 'high',
      sats: '',
      staffId: userSession.doctorId,
      supportingDocuments: [],
      todo: '',
      vitalSigns: [{ name: "" }],
      weight: 0,
      wT: 0

    },
  });
  const { control } = form
  const { append: appendContact, remove: removeSign, fields: signsFields, } = useFieldArray({ control: control, name: "vitalSigns" })

  const addSign = () => {
    appendContact({ name: "" })
  }

  const onSubmit = async (propsData: PreopSchemaWithoutMeta) => {
    if (!await form.trigger()) return
    const id = toast.loading(` ${uploadProgress} % Loading ...`)
    uploadMultipleFiles({
      files: propsData.supportingDocuments,
      options: {
        abortSignal: controller.signal,
        onProgress: ({ progress }) => {
          setUploadProgress(progress);
        },
      },
    }).then((data) => {
      createPreOpPatient(props.data.id, { ...propsData, supportingDocuments: data } as Omit<PreopSchema, 'id' | 'createAt' | 'updatedAt'>).then((res) => {
        toast[res.status](res.message, { id })
        if (res.status) {
          setTimeout(() => {

            toast.dismiss(id)
            router.back()
          }, 3000)

        }
      }
      ).catch(() => toast.error('Unable to Make Pre-operation Instance', { id }))
    }).finally(() => {

      setTimeout(() => {

        toast.dismiss(id)
      }, 3000)

    })

  }


  const [height, weight] = useWatch({
    control: control,
    name: ["hieght", "weight"],
  });

  useEffect(() => {
    const heightMeters = (height ?? 0) / 100;

    if (!heightMeters || !weight) return;

    const bmi = weight / (heightMeters * heightMeters);
    form.setValue("bmi", Number(bmi.toFixed(2)));

  }, [height, weight, form]);

  const { data } = props
  return <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full  flex-col  flex sm:px-7   mt-8 mb-20"
    >
      <fieldset disabled={form.formState.isSubmitting || userSession.userType == 'viewer'} className="w-full">
        <Section title="Patient Information" parentClassName="mb-10" className="grid grid-cols-2 space-x-6">
          <InfoField label="First Name" value={data.firstName} />
          <InfoField label="Middle Name" value={data.middleName} />
          <InfoField label="Last Name" value={data.lastName} />
          <InfoField label="Gender" value={capitalizeFirstLetter(data.gender)} />
          <InfoField label="Age" value={dateUtils.timeAgo(data.dateOfBirth).slice(0, 3)} />
          <AddressInfo label="Date Of Birth" value={dateUtils.formatFull(data.dateOfBirth)} />
          <AddressInfo label="Patients Address" value={data.address} />

          <InfoField label="Email" value={<a href={`mailto:${data.email}`} className={'text-xs hover:underline'}>{data.email}</a>} />
          <InfoField label="Phone Number" value={<a href={`tel:${data.phoneNumber}`} className={'text-xs hover:underline'}>{data.phoneNumber}</a>} />
          <InfoField label="Patient ID" value={data.id} />

        </Section>

        <div className="grid gap-3.5">

          <Section title="Descriptive Information" className="grid grid-cols-3 gap-2.5" parentClassName="">
            <div className="col-span-3 flex space-x-4 items-center ">

              < CommandSelectField<typeof preOpSchema> placeholder="Select Hospital" control={control} label="Hospital" name={'hospital'} options={[
                {
                  label: 'Adventist',
                  value: 'adventist',

                },
                {
                  label: 'Queens',
                  value: 'queens',
                },

              ]} />
              < CommandSelectField<typeof preOpSchema> placeholder="Select Priority" control={control} label="Priority" name={'riskPriority'} options={[
                {
                  label: 'Low',
                  value: 'low',
                  icon: <ArrowDown />
                },
                {
                  label: 'Mid',
                  value: 'mid',
                  icon: <CircleMinus />
                },
                {
                  label: 'High',
                  value: 'high',
                  icon: <ArrowUp />
                },
              ]} />
            </div>
            <AddressInput control={control} label='BSA' name="bsa" />
            <AddressInput control={control} label='TO DO' name="todo" />
            <AddressInput control={control} label='STATS' name="sats" />
            <div className="col-span-3 space-y-3">
              <TextEditor control={control} label='Diagnosis' name="diagnosis" />
              <TextEditor control={control} label='Denta History' name="dentalHistory" />
              <Section title="Signs" className="grid sm:grid-cols-2 gap-2.5"> {signsFields.map((_, id) => (<div key={id} className="relative space-y-4  my-3">
                {signsFields.length > 1 && <Button type="button" onClick={() => removeSign(id)} variant={'outline'} size={'icon'} className="hover:bg-destructive  hover:text-background absolute right-0.5 top-0.5 z-50"> <Trash2 /> </Button >}

                <TextInput
                  control={form.control}
                  label={`Sign `}
                  name={`vitalSigns.${id}.name`}
                  className="bg-accent/20"
                />


              </div>))}
              </Section>
              <Button type="button" onClick={addSign} disabled={signsFields.length > 6}>
                <Plus />
                Add Sign
              </Button>

            </div>

          </Section>







          <Section title="Measurements" className="gap-3 grid grid-cols-2">
            <div className="col-span-2 flex ">

              <InfoField label="Body mass Index (auto-calculated)" value={form.watch('bmi')} /> <span className="text-destructive text-sm">{form.formState.errors.bmi?.message}</span>
            </div>
            <SharesAllocationField step={0.1} maxShares={250} control={control} label="Hieght  (cm's) " name="hieght" />
            <SharesAllocationField step={0.1} maxShares={500} control={control} label="Weight  (kg's) " name="weight" />
            <SharesAllocationField step={0.1} maxShares={500} control={control} label='HF' name="hF" />
            <SharesAllocationField step={0.1} maxShares={500} control={control} label='Heart Rate' name="heartRate" />
            <SharesAllocationField step={0.1} maxShares={500} control={control} label='WT' name="wT" />
            <SharesAllocationField step={0.1} maxShares={500} control={control} label='Blood Pressure' name="bloodPressure" />


          </Section>

          <Section title="Upload Files" parentClassName="">
            <DropzoneField control={form.control} label="Supporting Documents" name="supportingDocuments" maxSize={1} maxFiles={12} />

          </Section>

        </div>
        <div className="flex justify-between">

          <Button type="submit" size="lg" className="mt-8 ">
            Submit
          </Button>
          {JSON.stringify({ ERR: form.formState.errors })}
          <Button type="button" size="lg" variant={'secondary'} onClick={() => form.reset()} className="mt-8 ">
            Clear
          </Button>
        </div>
      </fieldset>

    </form>
  </Form>
}