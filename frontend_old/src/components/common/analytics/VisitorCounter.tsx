import { useTranslation } from 'react-i18next';
import { useVisitorStats } from '@/hooks/useVisitorStats';

export default function VisitorCounter() {
  const { t } = useTranslation();
  const stats = useVisitorStats();

  return (
    <div className="text-sm text-muted-foreground flex gap-4">
      <span>{t('today_visitors')}: {stats.dailyVisitors}</span>
      <span>{t('yesterday_visitors')}: {stats.yesterdayVisitors}</span>
      <span>{t('total_visitors')}: {stats.totalVisitors}</span>
    </div>
  );
}
