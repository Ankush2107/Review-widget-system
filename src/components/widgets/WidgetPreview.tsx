'use client';

import { Widget, Review } from '@/lib/types';
import SliderWidget from './slider/SliderWidgets';
import GridWidget from './grid/GridWidget';
import ListWidget from './list/ListWidget';
import MasonryWidget from './masonry/MasonryWidget';
import BadgeWidget from './badge/BadgeWidget';

interface WidgetPreviewProps {
  widget: Widget;
  reviews?: Review[];
}

export default function WidgetPreview({ widget, reviews = [] }: WidgetPreviewProps) {
  // Sample reviews for preview if no reviews provided
  const sampleReviews: Review[] = reviews.length > 0 ? reviews : [
    {
      id: '1',
      source: 'google',
      rating: 5,
      content: 'Excellent service and great experience! Would highly recommend to anyone.',
      author: 'John Doe',
      date: new Date().toISOString(),
    },
    {
      id: '2',
      source: 'facebook',
      rating: 4,
      content: 'Very professional and responsive team. Great work!',
      author: 'Jane Smith',
      date: new Date().toISOString(),
    },
  ];

  const renderWidget = () => {
    switch (widget.settings.type) {
      case 'slider':
        return <SliderWidget reviews={sampleReviews} settings={widget.settings} />;
      case 'grid':
        return <GridWidget reviews={sampleReviews} settings={widget.settings} />;
      case 'list':
        return <ListWidget reviews={sampleReviews} settings={widget.settings} />;
      case 'masonry':
        return <MasonryWidget reviews={sampleReviews} settings={widget.settings} />;
      case 'badge':
        return <BadgeWidget reviews={sampleReviews} settings={widget.settings} />;
      default:
        return <div>Invalid widget type</div>;
    }
  };

  return (
    <div className={`widget-preview rounded-lg overflow-hidden ${
      widget.settings.theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`}>
      {renderWidget()}
    </div>
  );
}