import React, { useMemo } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useTheme } from "../context/ThemeContext";

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
  const { colors } = useTheme();
  const emojis = Array.isArray(emoji) ? emoji : [emoji];
  const [mainEmoji, accentEmoji] = emojis;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { alignItems: "center", paddingHorizontal: 8 },
        iconRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          gap: 8,
        },
        emoji: { fontSize: 56 },
        emojiAccent: { fontSize: 32 },
        title: {
          fontSize: 24,
          fontWeight: "700",
          color: colors.text,
          textAlign: "center",
          marginBottom: 12,
          paddingHorizontal: 16,
        },
        subtitle: {
          fontSize: 16,
          lineHeight: 24,
          color: colors.textSecondary,
          textAlign: "center",
          marginBottom: 28,
          paddingHorizontal: 8,
        },
        ctaCard: {
          backgroundColor: colors.appBackground,
          borderRadius: 16,
          paddingVertical: 18,
          paddingHorizontal: 20,
          borderWidth: 1,
          borderColor: colors.border,
        },
      }),
    [colors]
  );

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
