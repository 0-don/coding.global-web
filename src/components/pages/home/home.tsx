"use client";

import { motion } from "motion/react";
import { CommunityPreview } from "./community-preview";
import { CtaSection } from "./cta-section";
import { FeaturesSection } from "./features-section";
import { HeroSection } from "./hero-section";
import { LanguagesGrid } from "./languages-grid";
import { StatsSection } from "./stats-section";
import { TopContributors } from "./top-contributors";
import { TerminalHooksTest } from "./terminal-hooks-test";

export function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col"
    >
      {/* Terminal Hooks Test */}
      <section className="bg-muted/30 py-16">
        <TerminalHooksTest />
      </section>

      {/* Hero Section - Full viewport height */}
      <section className="flex min-h-[85vh] items-center justify-center py-20">
        <HeroSection />
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16">
        <StatsSection />
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
        <TopContributors />
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
