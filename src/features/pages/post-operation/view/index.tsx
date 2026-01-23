import { useQueryState } from "nuqs";

import LoadingPage from "@/components/loadingpage";
import { Section } from "@/components/review-componemts";

import { usePostOpIds } from "../postop.queries";
import { PostopSchema } from "@/lib/firebase/firebase.types";
import { useSharedState } from "@/components/providers/dashboard-context";
const Pre_operationviewModule = () => {
  const [ids] = useQueryState('id')
    ;

  const { data } = usePostOpIds({ id: ids || '',});
  if (!data) return <LoadingPage />
  return <div>
    {/* {(data.length ? data : []).map((patient, i) => <div className="flex relative" key={i}> <div className=" absolute -left-4 sm:left-0"><Badge className="text-base sm:mt-6 font-bold">{i + 1}</Badge></div> < PreopView data={patient} /></div>)} */}
    {/* {ids} */}
    {/* {data && data.length > 0 ? (  
      data?.map((patient, i) => <div className="flex relative" key={i}> <div className=" absolute -left-4 sm:left-0"><Badge className="text-base sm:mt-6 font-bold">{i + 1}</Badge></div> < PreopView data={patient} /></div>)
    ) : (
      <p>No post operation data found.</p>
    )} */}
    {JSON.stringify(data)}
    <div className="pt-20">
      <p></p>
    </div>
  </div>
};

export default Pre_operationviewModule;


export const PreopView = ({ data }: { data: PostopSchema }) => <div className="grid gap-4 max-w-full overflow-x-clip">
  {/* Diagnosis Section */}


  {/* Vital Signs */}
  <Section title="Post Op Data" className="flex flex-wrap gap-2.5">
    <pre className="">{JSON.stringify(data, null, 2)}</pre>
  </Section>


</div>
