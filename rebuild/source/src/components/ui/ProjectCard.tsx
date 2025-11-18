import Link from 'next/link';
import Image from 'next/image';
import { Icons } from '@/components/ui/icons';
import type { Project } from '@/graphql/queries/projects';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Use route structure: /gallery/[usecasesSlug]/[categoriesSlug]/[detailSlug]
  const usecasesSlug = 'projects'; // Default usecase
  const categoriesSlug = project.category?.slug || 'general';
  const projectUrl = `/gallery/${usecasesSlug}/${categoriesSlug}/${project.slug}`;

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={projectUrl}>
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="text-white text-4xl font-bold">
                {project.title.charAt(0)}
              </span>
            </div>
          )}
          {project.isFeatured && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={projectUrl}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
            {project.title}
          </h3>
        </Link>

        {project.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {project.description}
          </p>
        )}

        {project.category && (
          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {project.category.name}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Icons.eye className="w-4 h-4" />
              {project.viewsCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Icons.heart className="w-4 h-4" />
              {project.likesCount.toLocaleString()}
            </span>
          </div>

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Icons.externalLink className="w-4 h-4" />
              Demo
            </a>
          )}
        </div>

        {project.author && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
            {project.author.avatarUrl ? (
              <Image
                src={project.author.avatarUrl}
                alt={project.author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                {project.author.name.charAt(0)}
              </div>
            )}
            <span className="text-xs text-gray-600">{project.author.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
