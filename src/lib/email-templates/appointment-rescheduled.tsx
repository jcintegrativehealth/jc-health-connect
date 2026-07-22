// Appointment Rescheduled — sent when a scheduled visit is moved to a new time.
import * as React from "react";
import { Button, Hr, Section, Text } from "@react-email/components";
import { EmailLayout, styles } from "./_layout";

export interface AppointmentRescheduledProps {
  firstName?: string;
  previousDate: string;
  previousTime: string;
  newDate: string;
  newTime: string;
  format: "In-person" | "Telehealth" | string;
  provider?: string;
  service?: string;
  duration?: string;
  location?: string;
  joinUrl?: string;
  rescheduleUrl?: string;
  reason?: string;
  portalUrl?: string;
}

export function AppointmentRescheduled({
  firstName,
  previousDate,
  previousTime,
  newDate,
  newTime,
  format,
  provider = "Dr. Jason Chen, DO",
  service,
  duration,
  location,
  joinUrl,
  rescheduleUrl = "https://jc-health-connect.lovable.app/portal/appointments",
  reason,
  portalUrl = "https://jc-health-connect.lovable.app/portal",
}: AppointmentRescheduledProps) {
  const isTelehealth = String(format).toLowerCase().includes("tele");
  return (
    <EmailLayout
      preview={`Your appointment has been rescheduled to ${newDate} at ${newTime}.`}
      eyebrowLabel="Appointment Rescheduled"
      postscript="Reply to this email if the new time does not work — we will find an alternative."
    >
      <Text style={styles.h1}>
        {firstName ? `${firstName}, your visit has a new time.` : "Your visit has a new time."}
      </Text>
      <Hr style={styles.accentRule} />
      <Text style={styles.lede}>
        We have rescheduled your appointment. Please confirm the new details
        below and add them to your calendar.
      </Text>

      {reason ? (
        <Text style={styles.p}>
          <strong>Why:</strong> {reason}
        </Text>
      ) : null}

      <Section style={styles.detailCard}>
        <Text style={{ ...styles.detailLabel, color: "#C47D5A" }}>New Date &amp; Time</Text>
        <Text style={{ ...styles.detailValue, fontSize: "16px", color: "#1F3D2E" }}>
          {newDate} · {newTime}
        </Text>

        <Hr style={{ ...styles.divider, margin: "14px 0" }} />

        <Text style={styles.detailLabel}>Previous Date &amp; Time</Text>
        <Text style={{ ...styles.detailValue, textDecoration: "line-through", color: "#6B7A72" }}>
          {previousDate} · {previousTime}
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
        <Text style={styles.detailValue}>
          {format}
          {duration ? ` · ${duration}` : ""}
        </Text>

        {isTelehealth && joinUrl ? (
          <>
            <Text style={styles.detailLabel}>Join Link</Text>
            <Text style={{ ...styles.detailValue, marginBottom: 0 }}>
              <a href={joinUrl} style={{ color: "#1F3D2E" }}>
                {joinUrl}
              </a>
            </Text>
          </>
        ) : !isTelehealth && location ? (
          <>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={{ ...styles.detailValue, marginBottom: 0 }}>{location}</Text>
          </>
        ) : null}
      </Section>

      <Section style={styles.ctaWrap}>
        {isTelehealth && joinUrl ? (
          <Button href={joinUrl} style={styles.ctaPrimary}>
            Join Telehealth Visit
          </Button>
        ) : (
          <Button href={portalUrl} style={styles.ctaPrimary}>
            Open Patient Portal
          </Button>
        )}
        <Button href={rescheduleUrl} style={styles.ctaSecondary}>
          Reschedule Again
        </Button>
      </Section>

      <Text style={styles.p}>
        {isTelehealth
          ? "For telehealth visits, join two or three minutes early to test your camera and microphone. Use a quiet, well-lit space with a stable connection."
          : "Please arrive ten minutes early to complete intake. Bring a current list of medications and supplements, and any recent lab results you would like to review."}
      </Text>

      <Hr style={styles.divider} />
      <Text style={styles.small}>
        If the new time does not work, reply to this email as soon as possible so
        we can offer the slot to another patient and find a better fit for you.
      </Text>
    </EmailLayout>
  );
}

export default AppointmentRescheduled;
