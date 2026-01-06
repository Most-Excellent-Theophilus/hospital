const Page = async ({ params }: { params: Promise<{ action: string, page: string, id: string }> }) => {
    const { action, page, id } = await params
    return <>{action}/{page}/{id}</>;
}

export default Page;