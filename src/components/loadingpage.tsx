import { cn } from "@/lib/utils";

const fruits = [" col-span-1 ", " col-span-2 ", " col-span-2 "];

const LoadingPage = () => {
  return (
    <div className=" w-11/12 h-full  ">
      <div className="grid sm:grid-cols-2 gap-4 md:grid-cols-3  space-y-10">
        <LoadingSection className="col-span-2 " />
        <LoadingSection />
        {Array.from({ length: 7 }).map((_, idx) => (
          <LoadingSection
            key={idx}
            className={fruits[Math.floor(Math.random() * fruits.length)]}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingPage;

const LoadingSection = ({
  className, 
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div className={cn("w-full space-y-2 ", className)} {...props}>
      <div className="animate-pulse  mb-5 p-2 w-1/3 bg-primary/30 " />
      <div className="animate-pulse  mb-4 mt-7 p-1 w-1/2 bg-primary/30 " />
      {Array.from({ length: 10 }).map((_, idx) => (
        <div key={idx} className="animate-pulse bg-primary/30  p-1 w-full " />
      ))}
    </div>
  );
};
