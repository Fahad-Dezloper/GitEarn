import NewUser from "@/app/(dashboardComponents)/NewUser";
import { authOptions } from "@/lib/auth";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (user?.solanaAddress !== null) {
    redirect("/earn");
  }

  return (
    <NewUser email={session?.user?.email} />
  );
}