// Shared base layout for JC Integrative Health emails.
// All templates compose this shell so the visual identity stays consistent.
// Palette: Verde Floresta #1F3D2E · Verde Sálvia #436B52 · Terracota #C47D5A
//          Bege Claro #F0EDE5 · Off-White #FAF7F2
import * as React from "react";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const LOGO_URL =
  "https://jc-health-connect.lovable.app/__l5e/assets-v1/6ea1c81a-1ee0-4781-8ca1-adf7386e3e3a/jc-logo-mark.png";

export const brand = {
  navy: "#1F3D2E",
  sage: "#436B52",
  soft: "#A7C4BC",
  beige: "#F0EDE5",
  paper: "#FAF7F2",
  terracotta: "#C47D5A",
  ink: "#1F2A24",
  muted: "#6B7A72",
  border: "#E4E0D6",
} as const;

const main: React.CSSProperties = {
  backgroundColor: "#ffffff",
  fontFamily:
    "'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  color: brand.ink,
  margin: 0,
  padding: "40px 12px",
};

const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: brand.paper,
  border: `1px solid ${brand.border}`,
  borderRadius: "4px",
  overflow: "hidden",
};

const masthead: React.CSSProperties = {
  padding: "28px 32px 20px",
  borderBottom: `1px solid ${brand.border}`,
  backgroundColor: "#ffffff",
};

const brandRow: React.CSSProperties = {
  display: "inline-block",
  verticalAlign: "middle",
};

const brandJC: React.CSSProperties = {
  fontFamily: "'Crimson Pro', Georgia, 'Times New Roman', serif",
  fontSize: "22px",
  fontWeight: 600,
  letterSpacing: "-0.01em",
  color: brand.navy,
  margin: 0,
};

const brandSub: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: brand.sage,
  marginTop: "4px",
};

const eyebrow: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: brand.terracotta,
  margin: "0 0 12px",
};

const contentSection: React.CSSProperties = {
  padding: "32px 32px 8px",
};

const footerSection: React.CSSProperties = {
  padding: "24px 32px 28px",
  backgroundColor: brand.beige,
  borderTop: `1px solid ${brand.border}`,
};

const footerText: React.CSSProperties = {
  fontSize: "11px",
  lineHeight: "18px",
  color: brand.muted,
  margin: "0 0 6px",
};

const disclaimer: React.CSSProperties = {
  fontSize: "10px",
  lineHeight: "16px",
  color: brand.muted,
  margin: "12px 0 0",
  fontStyle: "italic",
};

export interface EmailLayoutProps {
  preview: string;
  eyebrowLabel?: string;
  children: React.ReactNode;
  /** Optional short line rendered above the disclaimer (e.g. "Reply directly to this email"). */
  postscript?: string;
}

/**
 * Base email shell — every JC Integrative Health template renders inside this.
 * Handles: masthead, hairlines, footer, address block, and HIPAA-friendly disclaimer.
 */
export function EmailLayout({
  preview,
  eyebrowLabel,
  children,
  postscript,
}: EmailLayoutProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={masthead}>
            <div style={brandRow}>
              <Img
                src={LOGO_URL}
                alt="JC Integrative Health"
                width={44}
                height={44}
                style={{ display: "block", marginBottom: 10, borderRadius: 4 }}
              />
              <div style={brandSub}>Integrative Health</div>
            </div>
          </Section>

          <Section style={contentSection}>
            {eyebrowLabel ? <Text style={eyebrow}>{eyebrowLabel}</Text> : null}
            {children}
          </Section>

          <Section style={footerSection}>
            {postscript ? (
              <Text style={footerText}>{postscript}</Text>
            ) : null}
            <Text style={footerText}>
              JC Integrative Health · Colorado &amp; Washington · Telehealth in
              supported states
            </Text>
            <Text style={footerText}>
              drjason@jcintegrativehealth.com
            </Text>
            <Hr style={{ borderColor: brand.border, margin: "14px 0 10px" }} />
            <Text style={disclaimer}>
              This message is intended for the named recipient and may contain
              information that is confidential and protected under HIPAA. If
              you received this email in error, please delete it and notify the
              sender. Not for medical emergencies — call 911 or your local
              emergency service.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Reusable typography and CTA styles for template bodies.
export const styles = {
  h1: {
    fontFamily: "'Crimson Pro', Georgia, 'Times New Roman', serif",
    fontSize: "26px",
    lineHeight: "32px",
    fontWeight: 500,
    color: brand.navy,
    letterSpacing: "-0.015em",
    margin: "0 0 16px",
  } as React.CSSProperties,
  lede: {
    fontSize: "15px",
    lineHeight: "24px",
    color: brand.ink,
    margin: "0 0 20px",
  } as React.CSSProperties,
  p: {
    fontSize: "14px",
    lineHeight: "22px",
    color: brand.ink,
    margin: "0 0 14px",
  } as React.CSSProperties,
  small: {
    fontSize: "12px",
    lineHeight: "18px",
    color: brand.muted,
    margin: "0 0 8px",
  } as React.CSSProperties,
  divider: {
    borderColor: brand.border,
    margin: "24px 0",
  } as React.CSSProperties,
  ctaWrap: {
    margin: "8px 0 24px",
  } as React.CSSProperties,
  ctaPrimary: {
    backgroundColor: brand.navy,
    color: brand.paper,
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    padding: "14px 22px",
    borderRadius: "2px",
    textDecoration: "none",
    display: "inline-block",
  } as React.CSSProperties,
  ctaSecondary: {
    backgroundColor: "transparent",
    color: brand.navy,
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    padding: "13px 22px",
    border: `1px solid ${brand.navy}`,
    borderRadius: "2px",
    textDecoration: "none",
    display: "inline-block",
    marginLeft: "8px",
  } as React.CSSProperties,
  detailCard: {
    backgroundColor: "#ffffff",
    border: `1px solid ${brand.border}`,
    borderRadius: "3px",
    padding: "18px 20px",
    margin: "0 0 20px",
  } as React.CSSProperties,
  detailLabel: {
    fontSize: "10px",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: brand.sage,
    margin: "0 0 4px",
  } as React.CSSProperties,
  detailValue: {
    fontSize: "14px",
    color: brand.ink,
    margin: "0 0 14px",
    lineHeight: "20px",
  } as React.CSSProperties,
  accentRule: {
    borderColor: brand.terracotta,
    borderTopWidth: "2px",
    width: "32px",
    margin: "0 0 20px 0",
  } as React.CSSProperties,
};
