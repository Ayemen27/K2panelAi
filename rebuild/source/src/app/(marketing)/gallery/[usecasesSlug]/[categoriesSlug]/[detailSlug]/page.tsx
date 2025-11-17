import type { Metadata } from "next";
import { ProjectDetailContent } from "./ProjectDetailContent";

export const metadata: Metadata = {
  title: "Gallery - Project Details - Replit",
  description: "View project details on Replit",
};

interface PageProps {
  params: {
    usecasesSlug: string;
    categoriesSlug: string;
    detailSlug: string;
  };
}

export default function ProjectDetailPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProjectDetailContent slug={params.detailSlug} />
      </div>
    </div>
  );
}
