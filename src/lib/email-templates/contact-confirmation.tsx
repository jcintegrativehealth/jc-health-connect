// Contact Confirmation — auto-reply after /contact form submission.
import * as React from "react";
import { Hr, Section, Text } from "@react-email/components";
import { EmailLayout, styles } from "./_layout";

export interface ContactConfirmationProps {
  firstName?: string;
  inquiryType?: string;
  messagePreview?: string;
  submittedAt?: string;
}

export function ContactConfirmation({
  firstName,
  inquiryType,
  messagePreview,
  submittedAt,
}: ContactConfirmationProps) {
  return (
    <EmailLayout
      preview="We have received your message — thank you for reaching out."
      eyebrowLabel="Message Received"
    >
      <Text style={styles.h1}>
        {firstName ? `Thank you, ${firstName}.` : "Thank you for reaching out."}
      </Text>
      <Hr style={styles.accentRule} />
      <Text style={styles.lede}>
        We have received your message and will respond within a few business
        days. Legitimate inquiries are reviewed carefully; we appreciate your
        patience.
      </Text>

      {(inquiryType || submittedAt || messagePreview) && (
        <Section style={styles.detailCard}>
          {inquiryType ? (
            <>
              <Text style={styles.detailLabel}>Inquiry Type</Text>
              <Text style={styles.detailValue}>{inquiryType}</Text>
            </>
          ) : null}
          {submittedAt ? (
            <>
              <Text style={styles.detailLabel}>Received</Text>
              <Text style={styles.detailValue}>{submittedAt}</Text>
            </>
          ) : null}
          {messagePreview ? (
            <>
              <Text style={styles.detailLabel}>Your Message</Text>
              <Text
                style={{
                  ...styles.detailValue,
                  marginBottom: 0,
                  whiteSpace: "pre-wrap",
                  fontStyle: "italic",
                }}
              >
                “{messagePreview}”
              </Text>
            </>
          ) : null}
        </Section>
      )}

      <Text style={styles.p}>
        This inbox is not monitored for medical emergencies. For urgent
        clinical concerns, please call 911 or your local emergency service.
      </Text>
    </EmailLayout>
  );
}

export default ContactConfirmation;
