'use client';

import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import { useTopContributors } from '@/hooks/useUsers';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

export default function Testimonials() {
  const t = useTranslations('home.testimonials');
  const { contributors, loading } = useTopContributors(6);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contributors.map((contributor) => (
            <div
              key={contributor.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-center">
                <Avatar
                  src={contributor.avatar}
                  alt={contributor.username}
                  size="lg"
                  className="mx-auto mb-4"
                />
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {contributor.firstName} {contributor.lastName}
                </h3>
                
                <p className="text-sm text-gray-500 mb-2">@{contributor.username}</p>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {contributor.bio}
                </p>

                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(contributor.averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {contributor.averageRating.toFixed(1)} ({contributor.totalRatings})
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 justify-center">
                  {contributor.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" size="sm">
                      {skill}
                    </Badge>
                  ))}
                  {contributor.skills.length > 3 && (
                    <Badge variant="outline" size="sm">
                      +{contributor.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}