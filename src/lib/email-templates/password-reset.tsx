// Password Reset — used for both patient portal and admin flows.
import * as React from "react";
import { Button, Hr, Section, Text } from "@react-email/components";
import { EmailLayout, styles } from "./_layout";

export interface PasswordResetProps {
  firstName?: string;
  resetUrl: string;
  expiresInMinutes?: number;
  audience?: "patient" | "admin";
}

export function PasswordReset({
  firstName,
  resetUrl,
  expiresInMinutes = 60,
  audience = "patient",
}: PasswordResetProps) {
  const label =
    audience === "admin" ? "Administrator Access" : "Patient Portal";
  return (
    <EmailLayout
      preview="Reset your password — link valid for a limited time."
      eyebrowLabel={label}
    >
      <Text style={styles.h1}>
        {firstName ? `${firstName}, reset your password.` : "Reset your password."}
      </Text>
      <Hr style={styles.accentRule} />
      <Text style={styles.lede}>
        We received a request to reset the password on your JC Integrative
        Health account. Use the button below to choose a new one.
      </Text>

      <Section style={styles.ctaWrap}>
        <Button href={resetUrl} style={styles.ctaPrimary}>
          Choose a New Password
        </Button>
      </Section>

      <Text style={styles.p}>
        This link expires in {expiresInMinutes} minute
        {expiresInMinutes === 1 ? "" : "s"}. If it stops working, request a new
        one from the sign-in screen.
      </Text>

      <Text style={styles.small}>
        If the button does not open, copy and paste this link into your
        browser:
      </Text>
      <Text
        style={{
          ...styles.small,
          wordBreak: "break-all",
          color: "#1F3D2E",
        }}
      >
        {resetUrl}
      </Text>

      <Hr style={styles.divider} />
      <Text style={styles.small}>
        Did not request this? You can safely ignore this email — your password
        will remain unchanged. If you suspect unusual activity, contact us at
        drjason@jcintegrativehealth.com.
      </Text>
    </EmailLayout>
  );
}

export default PasswordReset;
