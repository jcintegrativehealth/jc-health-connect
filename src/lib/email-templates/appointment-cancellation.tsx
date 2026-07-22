// Appointment Cancellation — sent when a patient or clinic cancels a scheduled visit.
import * as React from "react";
import { Button, Hr, Section, Text } from "@react-email/components";
import { EmailLayout, styles } from "./_layout";

export interface AppointmentCancellationProps {
  firstName?: string;
  date: string;
  time: string;
  format: "In-person" | "Telehealth" | string;
  provider?: string;
  service?: string;
  reason?: string;
  cancelledBy?: "patient" | "clinic";
  bookUrl?: string;
  portalUrl?: string;
  message?: string;
}

export function AppointmentCancellation({
  firstName,
  date,
  time,
  format,
  provider = "Dr. Jason Chen, DO",
  service,
  reason,
  cancelledBy = "clinic",
  bookUrl = "https://jc-health-connect.lovable.app/book",
  portalUrl = "https://jc-health-connect.lovable.app/portal",
  message,
}: AppointmentCancellationProps) {
  const cancelledByLabel = cancelledBy === "patient" ? "You cancelled this visit." : "We cancelled this visit.";
  return (
    <EmailLayout
      preview={`Appointment cancelled — ${date} at ${time}.`}
      eyebrowLabel="Appointment Cancelled"
      postscript="If you need to speak with someone directly, reply to this email or call the clinic."
    >
      <Text style={styles.h1}>
        {firstName ? `${firstName}, ${cancelledByLabel.toLowerCase()}` : cancelledByLabel}
      </Text>
      <Hr style={styles.accentRule} />
      <Text style={styles.lede}>
        The appointment below has been cancelled. No further action is needed on
        your part unless you would like to reschedule.
      </Text>

      <Section style={{ ...styles.detailCard, backgroundColor: "#FAF7F2" }}>
        <Text style={styles.detailLabel}>Date &amp; Time</Text>
        <Text style={{ ...styles.detailValue, textDecoration: "line-through", color: "#6B7A72" }}>
          {date} · {time}
        </Text>

        <Text style={styles.detailLabel}>Provider</Text>
        <Text style={styles.detailValue}>{provider}</Text>

        {service ? (
          <>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{service}</Text>
          </>
        ) : null}

        <Text style={styles.detailLabel}>Format</Text>
        <Text style={{ ...styles.detailValue, marginBottom: 0 }}>{format}</Text>

        {reason ? (
          <>
            <Hr style={{ ...styles.divider, margin: "14px 0" }} />
            <Text style={styles.detailLabel}>Reason</Text>
            <Text style={{ ...styles.detailValue, marginBottom: 0, fontStyle: "italic" }}>
              {reason}
            </Text>
          </>
        ) : null}
      </Section>

      {message ? (
        <Text style={styles.p}>{message}</Text>
      ) : (
        <Text style={styles.p}>
          We know schedules change. If you still need care, you can request a new
          appointment at a time that works better for you.
        </Text>
      )}

      <Section style={styles.ctaWrap}>
        <Button href={bookUrl} style={styles.ctaPrimary}>
          Reschedule Online
        </Button>
        <Button href={portalUrl} style={styles.ctaSecondary}>
          Visit Portal
        </Button>
      </Section>

      <Hr style={styles.divider} />
      <Text style={styles.small}>
        Cancellations made within 24 hours of a scheduled visit may be subject
        to the clinic’s late-notice policy. Questions? Reply to this email or
        contact us at drjason@jcintegrativehealth.com.
      </Text>
    </EmailLayout>
  );
}

export default AppointmentCancellation;
