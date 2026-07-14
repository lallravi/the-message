"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function setUserApprovalAction(userId: string, approved: boolean) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Not authorized.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { approved },
  });

  revalidatePath("/admin/users");
}
