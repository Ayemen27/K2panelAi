
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Users, 
  Activity, 
  Database, 
  Languages,
  TrendingUp,
  Server,
  Menu,
  X
} from 'lucide-react';
import { useTranslate } from '@/lib/i18n/hooks';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  bgColor: string;
}

function StatCard({ title, value, icon, trend, bgColor }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

function QuickAction({ title, description, icon, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 text-right w-full"
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </button>
  );
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslate('admin');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.title')}
          </h1>
          <p className="text-gray-600">{t('dashboard.subtitle')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <StatCard
            title={t('dashboard.users.total')}
            value="0"
            icon={<Users className="w-6 h-6 text-blue-600" />}
            bgColor="bg-blue-50"
          />
          <StatCard
            title={t('dashboard.projects.active')}
            value="0"
            icon={<Activity className="w-6 h-6 text-green-600" />}
            bgColor="bg-green-50"
          />
          <StatCard
            title={t('dashboard.servers.health')}
            value="MB 0"
            icon={<Database className="w-6 h-6 text-purple-600" />}
            bgColor="bg-purple-50"
          />
          <StatCard
            title={t('dashboard.users.new')}
            value="0"
            icon={<Languages className="w-6 h-6 text-orange-600" />}
            bgColor="bg-orange-50"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t('dashboard.quickActions.title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickAction
              title={t('dashboard.quickActions.manageUsers')}
              description={t('navigation.usersDesc')}
              icon={<Users className="w-5 h-5 text-white" />}
              onClick={() => router.push('/admin/users')}
            />
            <QuickAction
              title={t('dashboard.quickActions.viewServers')}
              description={t('navigation.databaseDesc')}
              icon={<Server className="w-5 h-5 text-white" />}
              onClick={() => router.push('/admin/database')}
            />
            <QuickAction
              title={t('dashboard.quickActions.systemSettings')}
              description={t('navigation.settingsDesc')}
              icon={<Database className="w-5 h-5 text-white" />}
              onClick={() => router.push('/admin/settings')}
            />
            <QuickAction
              title={t('dashboard.quickActions.viewLogs')}
              description={t('navigation.translationsDesc')}
              icon={<Activity className="w-5 h-5 text-white" />}
              onClick={() => router.push('/admin/translations')}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {t('dashboard.activity.title')}
            </h2>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              {t('dashboard.activity.viewAll')}
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  admin.recentActivity.userLogin
                </p>
                <p className="text-xs text-gray-500">admin.time.minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  admin.recentActivity.dbUpdate
                </p>
                <p className="text-xs text-gray-500">admin.time.minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  admin.recentActivity.translationUpload
                </p>
                <p className="text-xs text-gray-500">admin.time.hours</p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
