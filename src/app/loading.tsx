
import Logo from "@/components/logo";
import { Skeleton } from "@/components/ui/skeleton";

const GlobalLoadingPage = () => {
    return <div className="w-screen h-screen flex items-center justify-center">
        <div>

            <Logo className="animate-bounce" />
            <Skeleton className="w-52 h-5" />
        </div>

    </div>;
}

export default GlobalLoadingPage;