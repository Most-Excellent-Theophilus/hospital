const Page = async ({ params }: { params: Promise<{ page: string }> }) => {
    const { page } = await params
    return <>{page}</>;
}

export default Page;