"use client";

import { motion, useInView } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Sparkles,
  Newspaper,
  Code2,
  BookOpen,
  ShoppingBag,
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    titleKey: "HOME.FEATURES_CHAT_TITLE",
    descKey: "HOME.FEATURES_CHAT_DESC",
    href: "/chat",
  },
  {
    icon: Sparkles,
    titleKey: "HOME.FEATURES_SHOWCASE_TITLE",
    descKey: "HOME.FEATURES_SHOWCASE_DESC",
    href: "/community/showcase",
  },
  {
    icon: Newspaper,
    titleKey: "HOME.FEATURES_NEWS_TITLE",
    descKey: "HOME.FEATURES_NEWS_DESC",
    href: "/community/news",
  },
  {
    icon: Code2,
    titleKey: "HOME.FEATURES_BOARDS_TITLE",
    descKey: "HOME.FEATURES_BOARDS_DESC",
    href: "/community/coding/javascript",
  },
  {
    icon: BookOpen,
    titleKey: "HOME.FEATURES_RESOURCES_TITLE",
    descKey: "HOME.FEATURES_RESOURCES_DESC",
    href: "/resources",
  },
  {
    icon: ShoppingBag,
    titleKey: "HOME.FEATURES_MARKETPLACE_TITLE",
    descKey: "HOME.FEATURES_MARKETPLACE_DESC",
    href: "/marketplace",
  },
] as const;

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  index: number;
  inView: boolean;
}

function FeatureCard(props: FeatureCardProps) {
  const Icon = props.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={props.inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: props.index * 0.1 }}
    >
      <Link href={props.href}>
        <motion.div
          whileHover={{ y: -8 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="hover:border-primary h-full cursor-pointer transition-all hover:shadow-lg">
            <CardHeader>
              <div className="bg-primary/10 mb-2 w-fit rounded-lg p-3">
                <Icon className="text-primary h-6 w-6" />
              </div>
              <CardTitle className="text-lg">{props.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{props.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function FeaturesSection() {
  const t = useTranslations();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          {t("HOME.FEATURES_TITLE")}
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          {t("HOME.FEATURES_SUBTITLE")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.titleKey}
            icon={feature.icon}
            title={t(feature.titleKey)}
            description={t(feature.descKey)}
            href={feature.href}
            index={index}
            inView={inView}
          />
        ))}
      </div>
    </div>
  );
}
