import Link from "next/link";
import { buttonVariants } from "@/components/ui/button"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex  flex-col">  {children} <div className="p-5 "> <Link href={'/dashboard'} className={buttonVariants({ variant: "link" })}>Dashboard</Link></div></div>;
};

export default AuthLayout;
