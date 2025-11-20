
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { AdminNavbar } from "@/components/layout/AdminNavbar";

export const metadata: Metadata = {
  title: "K2Panel AI - Admin Dashboard",
  description: "Admin control panel",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login?callbackUrl=/admin/dashboard');
  }

  // تحقق من أن المستخدم هو مسؤول
  if (session.user?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="admin-layout min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
