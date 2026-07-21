// Appointment Request Received — sent immediately after /book submission.
// The visit is not yet confirmed; the clinic reviews and follows up.
import * as React from "react";
import { Hr, Section, Text } from "@react-email/components";
import { EmailLayout, styles } from "./_layout";

export interface AppointmentRequestReceivedProps {
  firstName?: string;
  requestedDate?: string;
  requestedTime?: string;
  format?: "In-person" | "Telehealth" | string;
  service?: string;
  referenceCode?: string;
}

export function AppointmentRequestReceived({
  firstName,
  requestedDate,
  requestedTime,
  format,
  service,
  referenceCode,
}: AppointmentRequestReceivedProps) {
  return (
    <EmailLayout
      preview="We have received your appointment request — a member of our team will confirm shortly."
      eyebrowLabel="Request Received"
    >
      <Text style={styles.h1}>
        {firstName ? `Thank you, ${firstName}.` : "Thank you."}
      </Text>
      <Hr style={styles.accentRule} />
      <Text style={styles.lede}>
        We have received your appointment request. A member of the clinical
        team will review it and reach out within one to two business days to
        confirm the time or offer alternatives.
      </Text>

      {(requestedDate || requestedTime || format || service) && (
        <Section style={styles.detailCard}>
          {service ? (
            <>
              <Text style={styles.detailLabel}>Service</Text>
              <Text style={styles.detailValue}>{service}</Text>
            </>
          ) : null}
          {requestedDate ? (
            <>
              <Text style={styles.detailLabel}>Requested Date</Text>
              <Text style={styles.detailValue}>{requestedDate}</Text>
            </>
          ) : null}
          {requestedTime ? (
            <>
              <Text style={styles.detailLabel}>Preferred Time</Text>
              <Text style={styles.detailValue}>{requestedTime}</Text>
            </>
          ) : null}
          {format ? (
            <>
              <Text style={styles.detailLabel}>Format</Text>
              <Text style={{ ...styles.detailValue, marginBottom: 0 }}>
                {format}
              </Text>
            </>
          ) : null}
        </Section>
      )}

      {referenceCode ? (
        <Text style={styles.small}>
          Reference code: <strong>{referenceCode}</strong> — please keep this
          for your records.
        </Text>
      ) : null}

      <Text style={styles.p}>
        This request is not a confirmed appointment. If your matter is urgent,
        please reply to this email. For medical emergencies, call 911.
      </Text>
    </EmailLayout>
  );
}

export default AppointmentRequestReceived;
