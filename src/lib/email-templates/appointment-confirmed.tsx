// Appointment Confirmed — sent once the clinical team schedules the visit.
import * as React from "react";
import { Button, Hr, Section, Text } from "@react-email/components";
import { EmailLayout, styles } from "./_layout";

export interface AppointmentConfirmedProps {
  firstName?: string;
  date: string;
  time: string;
  format: "In-person" | "Telehealth" | string;
  provider?: string;
  service?: string;
  duration?: string;
  location?: string;
  joinUrl?: string;
  rescheduleUrl?: string;
  preparationNotes?: string;
}

export function AppointmentConfirmed({
  firstName,
  date,
  time,
  format,
  provider = "Dr. Jason Chen, DO",
  service,
  duration,
  location,
  joinUrl,
  rescheduleUrl,
  preparationNotes,
}: AppointmentConfirmedProps) {
  const isTelehealth = String(format).toLowerCase().includes("tele");
  return (
    <EmailLayout
      preview={`Your appointment is confirmed — ${date} at ${time}.`}
      eyebrowLabel="Appointment Confirmed"
    >
      <Text style={styles.h1}>
        {firstName ? `${firstName}, your visit is confirmed.` : "Your visit is confirmed."}
      </Text>
      <Hr style={styles.accentRule} />
      <Text style={styles.lede}>
        We look forward to seeing you. Details of your appointment are below —
        please review and reach out if anything needs to change.
      </Text>

      <Section style={styles.detailCard}>
        <Text style={styles.detailLabel}>Date &amp; Time</Text>
        <Text style={styles.detailValue}>
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
        ) : null}

        {!isTelehealth && location ? (
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
              Join Telehealth Visit
            </Button>
          ) : null}
          {rescheduleUrl ? (
            <Button href={rescheduleUrl} style={styles.ctaSecondary}>
              Reschedule
            </Button>
          ) : null}
        </Section>
      )}

      {preparationNotes ? (
        <>
          <Text style={{ ...styles.p, fontWeight: 600 }}>
            Preparing for your visit
          </Text>
          <Text style={styles.p}>{preparationNotes}</Text>
        </>
      ) : (
        <>
          <Text style={{ ...styles.p, fontWeight: 600 }}>
            Preparing for your visit
          </Text>
          <Text style={styles.p}>
            Please have a current list of medications and supplements available,
            along with any recent labs. If this is a telehealth visit, join two
            or three minutes early to test your camera and microphone.
          </Text>
        </>
      )}

      <Hr style={styles.divider} />
      <Text style={styles.small}>
        Need to cancel or move this visit? Reply to this email or contact the
        clinic at drjason@jcintegrativehealth.com.
      </Text>
    </EmailLayout>
  );
}

export default AppointmentConfirmed;
