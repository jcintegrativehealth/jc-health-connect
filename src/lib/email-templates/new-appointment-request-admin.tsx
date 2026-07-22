// New Appointment Request — internal notification to the clinic inbox.
// Sent whenever a visitor submits the /book form so the clinical team can review and confirm.
import * as React from "react";
import { Hr, Section, Text, Link } from "@react-email/components";
import { EmailLayout, styles, brand } from "./_layout";

export interface NewAppointmentRequestAdminProps {
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  requestedDate?: string;
  requestedTime?: string;
  format?: "In-person" | "Telehealth" | string;
  service?: string;
  visitType?: string;
  state?: string;
  language?: string;
  notes?: string;
  referenceCode?: string;
  submittedAt?: string;
  reviewUrl?: string;
}

export function NewAppointmentRequestAdmin({
  patientName,
  patientEmail,
  patientPhone,
  requestedDate,
  requestedTime,
  format,
  service,
  visitType,
  state,
  language,
  notes,
  referenceCode,
  submittedAt,
  reviewUrl,
}: NewAppointmentRequestAdminProps) {
  return (
    <EmailLayout
      preview={`New appointment request${patientName ? ` from ${patientName}` : ""} — review in the admin dashboard.`}
      eyebrowLabel="New Request · Internal"
    >
      <Text style={styles.h1}>New appointment request</Text>
      <Hr style={styles.accentRule} />
      <Text style={styles.lede}>
        A new appointment request was submitted through the website
        {submittedAt ? ` on ${submittedAt}` : ""}. Please review and confirm or
        reach out to the patient within one to two business days.
      </Text>

      <Section style={styles.detailCard}>
        <Text style={styles.detailLabel}>Patient</Text>
        <Text style={styles.detailValue}>{patientName || "—"}</Text>

        {patientEmail ? (
          <>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>
              <Link href={`mailto:${patientEmail}`} style={{ color: brand.navy }}>
                {patientEmail}
              </Link>
            </Text>
          </>
        ) : null}

        {patientPhone ? (
          <>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{patientPhone}</Text>
          </>
        ) : null}

        {visitType ? (
          <>
            <Text style={styles.detailLabel}>Visit Type</Text>
            <Text style={styles.detailValue}>{visitType}</Text>
          </>
        ) : null}

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
            <Text style={styles.detailValue}>{format}</Text>
          </>
        ) : null}

        {state ? (
          <>
            <Text style={styles.detailLabel}>State</Text>
            <Text style={styles.detailValue}>{state}</Text>
          </>
        ) : null}

        {language ? (
          <>
            <Text style={styles.detailLabel}>Language</Text>
            <Text style={styles.detailValue}>{language}</Text>
          </>
        ) : null}

        {referenceCode ? (
          <>
            <Text style={styles.detailLabel}>Reference</Text>
            <Text style={{ ...styles.detailValue, marginBottom: 0 }}>
              {referenceCode}
            </Text>
          </>
        ) : null}
      </Section>

      {notes ? (
        <>
          <Text style={styles.detailLabel}>Patient Notes</Text>
          <Text
            style={{
              ...styles.p,
              backgroundColor: "#ffffff",
              border: `1px solid ${brand.border}`,
              borderRadius: "3px",
              padding: "14px 16px",
              whiteSpace: "pre-wrap",
            }}
          >
            {notes}
          </Text>
        </>
      ) : null}

      {reviewUrl ? (
        <Section style={styles.ctaWrap}>
          <Link href={reviewUrl} style={styles.ctaPrimary}>
            Review in Admin
          </Link>
        </Section>
      ) : null}

      <Text style={styles.small}>
        This is an internal notification for the JC Integrative Health clinical
        team. The patient has received a separate confirmation that their
        request was received.
      </Text>
    </EmailLayout>
  );
}

export default NewAppointmentRequestAdmin;
