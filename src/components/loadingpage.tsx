
import Logo from "./logo";



const LoadingPage = () => {
  return (
        <div className=" h-screen flex items-center justify-center">
        <div className="space-y-1 flex flex-col items-center justify-center">

            <Logo className="animate-bounce" />
            <h1 className="font-black text-primary animate-pulse">Please Wait...</h1>
        </div>

    </div>
  
  );
};

export default LoadingPage;

