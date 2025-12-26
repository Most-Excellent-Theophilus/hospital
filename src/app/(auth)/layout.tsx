
import { getSession } from "@/features/auth/auth.session";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession()
  if (session.email) {
    redirect('/dashboard')
  }
  return <div className="flex  flex-col">  {children} </div>;
};

export default AuthLayout;
