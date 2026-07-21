// Appointment Reminder — sent ~24 hours before the scheduled visit.
import * as React from "react";
import { Button, Hr, Section, Text } from "@react-email/components";
import { EmailLayout, styles } from "./_layout";

export interface AppointmentReminderProps {
  firstName?: string;
  date: string;
  time: string;
  format: "In-person" | "Telehealth" | string;
  provider?: string;
  location?: string;
  joinUrl?: string;
  rescheduleUrl?: string;
}

export function AppointmentReminder({
  firstName,
  date,
  time,
  format,
  provider = "Dr. Jason Chen, DO",
  location,
  joinUrl,
  rescheduleUrl,
}: AppointmentReminderProps) {
  const isTelehealth = String(format).toLowerCase().includes("tele");
  return (
    <EmailLayout
      preview={`Reminder — your visit with ${provider} is tomorrow at ${time}.`}
      eyebrowLabel="Reminder · 24 hours"
    >
      <Text style={styles.h1}>
        {firstName ? `${firstName}, this is a gentle reminder.` : "A gentle reminder."}
      </Text>
      <Hr style={styles.accentRule} />
      <Text style={styles.lede}>
        Your appointment with {provider} is tomorrow. A short summary is below
        — everything you need to arrive prepared.
      </Text>

      <Section style={styles.detailCard}>
        <Text style={styles.detailLabel}>When</Text>
        <Text style={styles.detailValue}>
          {date} · {time}
        </Text>

        <Text style={styles.detailLabel}>Format</Text>
        <Text style={styles.detailValue}>{format}</Text>

        {isTelehealth && joinUrl ? (
          <>
            <Text style={styles.detailLabel}>Join Link</Text>
            <Text style={{ ...styles.detailValue, marginBottom: 0 }}>
              <a href={joinUrl} style={{ color: "#1F3D2E" }}>
                {joinUrl}
              </a>
            </Text>
          </>
        ) : location ? (
          <>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={{ ...styles.detailValue, marginBottom: 0 }}>
              {location}
            </Text>
          </>
        ) : null}
      </Section>

      {(joinUrl || rescheduleUrl) && (
        <Section style={styles.ctaWrap}>
          {isTelehealth && joinUrl ? (
            <Button href={joinUrl} style={styles.ctaPrimary}>
              Join Visit
            </Button>
          ) : null}
          {rescheduleUrl ? (
            <Button href={rescheduleUrl} style={styles.ctaSecondary}>
              Reschedule
            </Button>
          ) : null}
        </Section>
      )}

      <Text style={styles.p}>
        {isTelehealth
          ? "Join two or three minutes early to test your camera and microphone. A quiet, well-lit space and a stable connection will make the visit smoother."
          : "Please arrive ten minutes early to complete any final intake steps. Bring a current list of medications and supplements, and any recent lab results you would like to review."}
      </Text>

      <Hr style={styles.divider} />
      <Text style={styles.small}>
        If something has changed and you can no longer attend, please reply to
        this email as soon as possible so we can offer the time to another
        patient.
      </Text>
    </EmailLayout>
  );
}

export default AppointmentReminder;
