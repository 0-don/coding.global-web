import posthog from "posthog-js";

/**
 * Analytics utility for tracking user events with PostHog.
 *
 * Events currently tracked:
 *
 * ALREADY IMPLEMENTED:
 * - theme_changed: User changes theme (light/dark/system)
 * - language_changed: User changes locale
 * - search_performed: User performs a search query
 * - search_result_clicked: User clicks on a search result
 * - terminal_command_executed: User runs a command in the hero terminal
 * - hero_cta_clicked: User clicks a CTA button on the hero section
 * - user_signed_in: User logs in via Discord
 * - view_mode_changed: User switches between grid/list view
 * - sort_order_changed: User changes sort order
 * - archived_filter_changed: User changes archived filter
 * - tag_filter_changed: User adds/removes a tag filter
 * - tag_filter_cleared: User clears all tag filters
 * - thread_opened: User opens a thread/showcase item
 *
 * This file provides typed helpers for custom event tracking.
 */

export const analytics = {
  // CTA clicks (for places without direct posthog import)
  ctaClicked: (ctaName: string, destination: string) => {
    posthog.capture("cta_clicked", {
      cta_name: ctaName,
      destination,
    });
  },

  // External link tracking
  externalLinkClicked: (linkUrl: string, linkText: string, section: string) => {
    posthog.capture("external_link_clicked", {
      link_url: linkUrl,
      link_text: linkText,
      section,
    });
  },

  // Resource interactions
  resourceViewed: (resourceType: string, resourceName: string) => {
    posthog.capture("resource_viewed", {
      resource_type: resourceType,
      resource_name: resourceName,
    });
  },

  // Copy code
  codeCopied: (language: string, section: string) => {
    posthog.capture("code_copied", {
      language,
      section,
    });
  },

  // Error tracking
  errorOccurred: (errorMessage: string, errorLocation: string) => {
    posthog.capture("error_occurred", {
      error_message: errorMessage,
      error_location: errorLocation,
    });
  },

  // Discord join
  discordJoinClicked: (section: string) => {
    posthog.capture("discord_join_clicked", {
      section,
    });
  },

  // Language card clicked (community page)
  languageCardClicked: (language: string) => {
    posthog.capture("language_card_clicked", {
      language,
    });
  },
};
