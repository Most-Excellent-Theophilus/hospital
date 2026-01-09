import { useQueryState } from "nuqs";

import { zodResolver } from "@hookform/resolvers/zod";

import { useFieldArray, useForm } from "react-hook-form";

import { usePatient } from "../preop.queries";
;
import LoadingPage from "@/components/loadingpage";
import { useSharedState } from "@/components/providers/dashboard-context";
import { preOpSchema, PreopSchemaWithoutMeta } from "../preop.types";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import AddressInput from "@/components/form/auth/inputs/address-input";
import TextInput from "@/components/form/auth/inputs/text-input";
import { Trash2 } from "lucide-react";
import { Section } from "@/components/review-componemts";
import DropzoneField from "@/components/form/auth/inputs/file-uploader";



const PatientsviewModule = () => {
  const [ids] = useQueryState('id')


  const { data } = usePatient(ids!)


  const { value: userSession } = useSharedState()


  const form = useForm<PreopSchemaWithoutMeta>({
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
      hieght: 0,
      hospital: 'adventist',
      patientId: ids!,
      riskPriority: 'high',
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

  const onSubmit = () => {

  }
  if (!data) return <LoadingPage />
  return <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full   flex sm:px-7   mt-8 mb-20"
    >
      <fieldset disabled={form.formState.isSubmitting || userSession.userType == 'viewer'} className="w-full">
        <div className="grid sm:grid-cols-2 gap-3.5">


          <Section title="Descriptive Information">  <AddressInput control={control} label='Diagnosis' name="diagnosis" />
            <AddressInput control={control} label='Denta History' name="dentalHistory" />
            <TextInput control={control} label='BSA' name="bsa" />
            <AddressInput control={control} label='TO DO' name="todo" />
            <TextInput control={control} label='STATS' name="sats" /></Section>



          <Section title="Signs"> {signsFields.map((_, id) => (<div key={id} className="relative space-y-4  my-3">
            {signsFields.length > 1 && <Button type="button" onClick={() => removeSign(id)} variant={'outline'} size={'icon'} className="hover:bg-destructive  hover:text-background absolute right-0.5 top-0.5 z-50"> <Trash2 /> </Button >}

            <TextInput
              control={form.control}
              label={`Sign `}
              name={`vitalSigns.${id}.name`}
              className="bg-accent/20"
            />


          </div>))}
            <Button type="button" onClick={addSign} disabled={signsFields.length > 6}>Add Sign</Button>
          </Section>



          <Section title="Measurements" className="space-y-3">
            <TextInput control={control} value={form.watch('hieght')}  label='Body mass Index (auto-calculated)' step={'0.1'} type="number" name="bmi" />
            <TextInput control={control} label="Hieght  (cm's) " type="number" name="hieght" />
            <TextInput control={control} label="Weight  (kg's) " step={'0.1'} type="number" name="weight" />
            <TextInput control={control} label='HF' step={'0.1'} type="number" name="hF" />
            <TextInput control={control} label='Heart Rate' step={'0.1'} type="number" name="heartRate" />
            <TextInput control={control} label='Heart Rate' step={'0.1'} type="number" name="heartRate" />
            <TextInput control={control} label='WT' step={'0.1'} type="number" name="wT" />


          </Section>

          <Section title="Upload Files">
            <DropzoneField control={form.control} label="Supporting Documents" name="supportingDocuments" maxSize={1} maxFiles={12} />

          </Section>

        </div>
        <div className="flex justify-between">

          <Button type="submit" size="lg" className="mt-8 ">
            Submit
          </Button>
          <Button type="button" size="lg" variant={'secondary'} onClick={()=> form.reset()} className="mt-8 ">
            Clear
          </Button>
        </div>
      </fieldset>

    </form>
  </Form>
};

export default PatientsviewModule;