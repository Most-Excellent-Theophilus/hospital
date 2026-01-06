import { isValidAction, isValidModule } from "@/components/app-sidebar/config";
import NotFoundPage from "@/components/not-found";
import { ResourceGate } from "@/features/pages";

const Page = async ({ params }: { params: Promise<{ action: string, page: string }> }) => {
    const { action, page } = await params
    if (!isValidModule(page) || !isValidAction(action)) return <NotFoundPage />

    return <ResourceGate md={page} smd={action} />;
}

export default Page;