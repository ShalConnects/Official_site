import React, { useMemo } from 'react';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import PageContainer from '../components/PageContainer';
import PageSection from '../components/PageSection';
import ReviewsMarquee from '../components/ReviewsMarquee';
import { getAllReviewImages, getScrollDurationSec } from '../data/reviewImages';

export default function ReviewsPage() {
  const allImages = useMemo(() => getAllReviewImages(), []);
  const imagesPerColumn = Math.ceil(allImages.length / 3);
  const scrollDurationSec = getScrollDurationSec(imagesPerColumn);

  return (
    <PageLayout title="All Reviews - ShalConnects">
      <PageHero
        title="Platform Reviews"
        description="Verified reviews from Fiverr and Upwork"
      />
      <PageSection className="relative w-full" style={{
        background: 'linear-gradient(to bottom, rgba(21, 102, 65, 0.05), rgba(218, 101, 30, 0.03))'
      }}>
        <div className="absolute top-0 left-0 right-0 h-px opacity-20" style={{
          background: 'linear-gradient(to right, transparent, rgba(21, 102, 65, 0.5), rgba(218, 101, 30, 0.5), transparent)'
        }} />
        <PageContainer>
          <ReviewsMarquee images={allImages} scrollDurationSec={scrollDurationSec} />
        </PageContainer>
      </PageSection>
    </PageLayout>
  );
}
