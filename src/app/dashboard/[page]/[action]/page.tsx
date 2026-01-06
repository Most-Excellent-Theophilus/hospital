const Page = async ({ params }: { params: Promise<{ action: string, page: string }> }) => {
    const { action, page } = await params
    return <>{action}/{page}</>;
}

export default Page;