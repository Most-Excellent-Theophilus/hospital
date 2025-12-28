import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

const LoadingBar = () => {
    return <div className=" absolute top-18 left-50 z-[500] w-1/2"><Alert>
        <Spinner />
        <AlertTitle className="animate-pulse">
            Loading...
        </AlertTitle>
    </Alert></div>;
}

export default LoadingBar;