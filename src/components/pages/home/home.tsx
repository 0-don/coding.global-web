"use client";

import { motion } from "motion/react";
import { Suspense } from "react";
import { HeroSection } from "./hero-section";
import { StatsSection } from "./stats-section";
import { FeaturesSection } from "./features-section";
import { LanguagesGrid } from "./languages-grid";
import { TopContributors } from "./top-contributors";
import { CommunityPreview } from "./community-preview";
import { CtaSection } from "./cta-section";
import { Skeleton } from "@/components/ui/skeleton";

function SectionSkeleton() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-96" />
        <div className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    </div>
  );
}

export function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col"
    >
      {/* Hero Section - Full viewport height */}
      <section className="flex min-h-[85vh] items-center justify-center py-20">
        <HeroSection />
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16">
        <Suspense fallback={<SectionSkeleton />}>
          <StatsSection />
        </Suspense>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <FeaturesSection />
      </section>

      {/* Languages Grid */}
      <section className="bg-muted/30 py-24">
        <LanguagesGrid />
      </section>

      {/* Top Contributors */}
      <section className="py-24">
        <Suspense fallback={<SectionSkeleton />}>
          <TopContributors />
        </Suspense>
      </section>

      {/* Community Preview with Discord Widget */}
      <section className="bg-muted/30 py-24">
        <CommunityPreview />
      </section>

      {/* Final CTA */}
      <section className="from-primary/10 via-primary/5 to-background bg-linear-to-br py-32">
        <CtaSection />
      </section>
    </motion.div>
  );
}
