import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { AppColors } from "./ui/ThemeColors";

export type EmptyStateTemplateProps = {
  /** Main emoji or [main, accent] e.g. "📋" or ["📋", "✨"] */
  emoji: string | [string, string?];
  /** Headline text */
  title: string;
  /** Supporting copy below the title */
  subtitle: string;
  /** Optional CTA card content (e.g. text with highlighted word). Omit to hide the card. */
  ctaContent?: React.ReactNode;
};

export default function EmptyStateTemplate({
  emoji,
  title,
  subtitle,
  ctaContent,
}: EmptyStateTemplateProps) {
  const { width } = useWindowDimensions();
  const emojis = Array.isArray(emoji) ? emoji : [emoji];
  const [mainEmoji, accentEmoji] = emojis;

  return (
    <View style={styles.container}>
      <View style={styles.iconRow}>
        <Text style={styles.emoji}>{mainEmoji}</Text>
        {accentEmoji != null && (
          <Text style={styles.emojiAccent}>{accentEmoji}</Text>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {ctaContent != null && (
        <View style={[styles.ctaCard, { width: width - 48 }]}>
          {ctaContent}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 8,
  },
  emoji: {
    fontSize: 56,
  },
  emojiAccent: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: AppColors.TextDark,
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: AppColors.SlateGray,
    textAlign: "center",
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  ctaCard: {
    backgroundColor: AppColors.AppBackground,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(10, 126, 164, 0.2)",
  },
});

/** Use these inside ctaContent for consistent CTA text styling */
export const emptyStateCtaStyles = {
  text: {
    fontSize: 15,
    color: AppColors.SlateGray,
    textAlign: "center" as const,
  },
  highlight: {
    fontWeight: "700" as const,
    color: AppColors.BrandBlue,
  },
};
