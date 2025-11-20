'use client';

import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
import {
  GET_FEATURED_PROJECTS,
  type GetFeaturedProjectsData,
  type GetFeaturedProjectsVariables,
} from '@/graphql/queries/projects';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { ProjectGridSkeleton } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useTranslate } from '@/lib/i18n/hooks';

export function HomeContent() {
  const { t } = useTranslate('marketing');
  const { data, loading, error, refetch } = useQuery<
    GetFeaturedProjectsData,
    GetFeaturedProjectsVariables
  >(GET_FEATURED_PROJECTS, {
    variables: {
      perPage: 6,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                {t('home.hero.cta.primary')}
              </Link>
              <Link
                href="/gallery"
                className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors border border-blue-400"
              >
                {t('home.hero.cta.secondary')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-gray-900">
              {t('home.featured.title')}
            </h2>
          </div>
          <Link
            href="/gallery"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            {t('home.featured.viewAll')}
            <Icons.arrowRight className="w-5 h-5" />
          </Link>
        </div>

        {error ? (
          <ErrorMessage
            message={error.message}
            onRetry={() => refetch()}
          />
        ) : loading ? (
          <ProjectGridSkeleton count={6} />
        ) : data?.featuredProjects && data.featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 text-lg">
              {t('home.featured.noProjects')}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                10M+
              </div>
              <div className="text-gray-600">
                {t('home.stats.developers')}
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                50M+
              </div>
              <div className="text-gray-600">
                {t('home.stats.projects')}
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-pink-600 mb-2">
                100+
              </div>
              <div className="text-gray-600">
                {t('home.stats.languages')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {t('home.cta.subtitle')}
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            {t('home.cta.button')}
          </Link>
        </div>
      </div>
    </div>
  );
}
