import { usePostOps } from "./postop.queries";

const Post_operationModule = () => {
  const { data } = usePostOps()
  return <div>{JSON.stringify(data)}</div>;
};

export default Post_operationModule;