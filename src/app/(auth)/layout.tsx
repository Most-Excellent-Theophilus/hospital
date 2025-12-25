import Link from "next/link";
import { buttonVariants } from "@/components/ui/button"
import { getSession } from "@/features/auth/auth.session";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession()
  if (session.email) {
    redirect('/dashboard')
  }
  return <div className="flex  flex-col">  {children} <div className="p-5 "> <Link href={'/dashboard'} className={buttonVariants({ variant: "link" })}>Dashboard</Link></div></div>;
};

export default AuthLayout;
