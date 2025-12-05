
import React from 'react';
import { Translation } from '../types';
import SectionCardGrid, { SectionCardItem } from './SectionCardGrid';
import {
  TrendingUp,
  Calendar,
  Box,
  MousePointerClick,
  BarChart3,
  Users,
  Tag,
  Filter,
  LineChart,
  FileSpreadsheet,
} from 'lucide-react';

interface Props {
  t: Translation['featuresSection'];
}

const FeaturesSection: React.FC<Props> = ({ t }) => {
  const features: SectionCardItem[] = [
    {
      id: 'features-sales',
      title: t.cards.sales.title,
      desc: t.cards.sales.desc,
      icon: <TrendingUp className="w-6 h-6" />,
      colSpan: 'md:col-span-2',
    },
    {
      title: t.cards.period.title,
      desc: t.cards.period.desc,
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      title: t.cards.products.title,
      desc: t.cards.products.desc,
      icon: <Box className="w-6 h-6" />,
    },
    {
      title: t.cards.conversion.title,
      desc: t.cards.conversion.desc,
      icon: <MousePointerClick className="w-6 h-6" />,
    },
    {
      id: 'features-marketing',
      title: t.cards.marketing.title,
      desc: t.cards.marketing.desc,
      icon: <BarChart3 className="w-6 h-6" />,
      colSpan: 'md:col-span-2',
    },
    {
      id: 'features-customers',
      title: t.cards.customers.title,
      desc: t.cards.customers.desc,
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: t.cards.discounts.title,
      desc: t.cards.discounts.desc,
      icon: <Tag className="w-6 h-6" />,
    },
    {
      title: t.cards.funnel.title,
      desc: t.cards.funnel.desc,
      icon: <Filter className="w-6 h-6" />,
    },
    {
      title: t.cards.trends.title,
      desc: t.cards.trends.desc,
      icon: <LineChart className="w-6 h-6" />,
    },
    {
      title: t.cards.export.title,
      desc: t.cards.export.desc,
      icon: <FileSpreadsheet className="w-6 h-6" />,
    },
  ];

  return <SectionCardGrid title={t.title} items={features} gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />;
};

export default FeaturesSection;
