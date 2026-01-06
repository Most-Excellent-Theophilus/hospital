import { isValidModule } from "@/components/app-sidebar/config";
import NotFoundPage from "@/components/not-found";
import { ModuleGate } from "@/features/pages";

const Page = async ({ params }: { params: Promise<{ page: string }> }) => {
    const { page } = await params
    if (!isValidModule(page)) {
        return <NotFoundPage />
    }
    return <ModuleGate md={page}/>;
}

export default Page;