// Welcome — sent after a patient completes account creation on the portal.
import * as React from "react";
import { Button, Hr, Section, Text } from "@react-email/components";
import { EmailLayout, styles } from "./_layout";

export interface WelcomeEmailProps {
  firstName?: string;
  portalUrl?: string;
  completeProfileUrl?: string;
}

export function WelcomeEmail({
  firstName,
  portalUrl = "https://jc-health-connect.lovable.app/portal",
  completeProfileUrl,
}: WelcomeEmailProps) {
  const greeting = firstName ? `Welcome, ${firstName}.` : "Welcome.";
  return (
    <EmailLayout
      preview="Welcome to JC Integrative Health — your patient portal is ready."
      eyebrowLabel="Patient Portal"
      postscript="Reply directly to this email if you have a question."
    >
      <Text style={styles.h1}>{greeting}</Text>
      <Hr style={styles.accentRule} />
      <Text style={styles.lede}>
        Thank you for choosing JC Integrative Health. Your patient portal is
        active — a private space to review your care plan, message the clinic,
        upload documents, and prepare for upcoming visits.
      </Text>

      <Text style={styles.p}>
        We practice evidence-based integrative medicine with a long view of
        health. Before your first visit, we will ask you to complete a brief
        intake so we can make the most of your time together.
      </Text>

      <Section style={styles.ctaWrap}>
        <Button href={portalUrl} style={styles.ctaPrimary}>
          Open Patient Portal
        </Button>
        {completeProfileUrl ? (
          <Button href={completeProfileUrl} style={styles.ctaSecondary}>
            Complete Intake
          </Button>
        ) : null}
      </Section>

      <Hr style={styles.divider} />

      <Text style={styles.small}>
        A brief note on privacy: the portal is protected and communications are
        handled in line with HIPAA. If you did not create this account, please
        contact us at drjason@jcintegrativehealth.com.
      </Text>
    </EmailLayout>
  );
}

export default WelcomeEmail;
