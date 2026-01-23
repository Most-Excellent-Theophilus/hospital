import { useQueryState } from "nuqs";
import { usePreopIds } from "../../pre-operation/preop.queries";
import LoadingPage from "@/components/loadingpage";
import { PreopView } from "../../pre-operation/view";
import CreatePostOp from "./form";
const Post_operationcreateModule = () => {
  const [ids] = useQueryState('id')

  const { data } = usePreopIds({id:ids || ""})
  if (!data) {
    return <LoadingPage />
  }
  return <div className="px-4 py-6 space-y-6">
    <CreatePostOp data={data[0]} /> 
    <PreopView data={data[0]} />


    <div className="pb-16" />
  </div>;
};

export default Post_operationcreateModule;