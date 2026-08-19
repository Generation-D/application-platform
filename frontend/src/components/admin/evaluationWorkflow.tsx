"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  EvaluationDashboardData,
  finishPhaseEvaluation,
  previewReviewerMatching,
  saveBulkPhaseDecisions,
  savePhaseDecision,
  saveReviewerAssignments,
  sendReviewerAssignmentEmails,
  sendReviewerTestEmail,
} from "@/actions/evaluation";
import { ReviewEmailDefaults } from "@/config/reviewEmailConfig";
import { ReviewerAssignment } from "@/utils/reviewerMatching";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unbekannter Fehler";
}

function decisionKey(phaseId: string, applicantUserId: string) {
  return `${phaseId}:${applicantUserId}`;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase().replace("@googlemail.com", "@gmail.com");
}

const fieldClass =
  "mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm text-secondary";

export default function EvaluationWorkflow({
  data,
}: {
  data: EvaluationDashboardData;
}) {
  const router = useRouter();
  const defaultPhase =
    data.phases.find((phase) => phase.finished_evaluation === null) ??
    data.phases[0];
  const [phaseId, setPhaseId] = useState(defaultPhase?.phaseid ?? "");
  const [csvText, setCsvText] = useState("");
  const [reviewersPerApplication, setReviewersPerApplication] = useState(2);
  const [preview, setPreview] = useState<ReviewerAssignment[]>([]);
  const [emailSettings, setEmailSettings] = useState<ReviewEmailDefaults>(
    data.emailDefaults,
  );
  const [approvedEmails, setApprovedEmails] = useState("");
  const [decisions, setDecisions] = useState<
    Record<string, boolean | undefined>
  >(
    Object.fromEntries(
      data.outcomes.map((outcome) => [
        decisionKey(outcome.phaseId, outcome.applicantUserId),
        outcome.outcome,
      ]),
    ),
  );
  const [pendingAction, setPendingAction] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const selectedPhase = data.phases.find((phase) => phase.phaseid === phaseId);
  const currentAssignments = data.assignments.filter(
    (assignment) => assignment.phaseId === phaseId,
  );
  const eligibleApplicantIds = new Set(
    data.eligibleApplicantIdsByPhase[phaseId] ?? [],
  );
  const eligibleApplications = data.applications.filter((application) =>
    eligibleApplicantIds.has(application.applicantUserId),
  );

  const currentAssignmentsByApplication = useMemo(() => {
    const grouped = new Map<string, typeof currentAssignments>();
    for (const assignment of currentAssignments) {
      const assignments = grouped.get(assignment.applicationId) ?? [];
      assignments.push(assignment);
      grouped.set(assignment.applicationId, assignments);
    }
    return grouped;
  }, [currentAssignments]);

  async function runAction(name: string, action: () => Promise<string>) {
    setPendingAction(name);
    setNotice("");
    setError("");
    try {
      setNotice(await action());
    } catch (caughtError) {
      setError(errorMessage(caughtError));
    } finally {
      setPendingAction("");
    }
  }

  async function readCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setCsvText(file ? await file.text() : "");
    setPreview([]);
  }

  function updateEmailSetting<Key extends keyof ReviewEmailDefaults>(
    key: Key,
    value: ReviewEmailDefaults[Key],
  ) {
    setEmailSettings((current) => ({ ...current, [key]: value }));
  }

  if (!selectedPhase) {
    return <p className="mt-6">Es wurden keine Phasen gefunden.</p>;
  }

  return (
    <div className="mt-8 space-y-8">
      <label className="block font-semibold">
        Phase
        <select
          className={fieldClass}
          value={phaseId}
          onChange={(event) => {
            setPhaseId(event.target.value);
            setPreview([]);
            setNotice("");
            setError("");
          }}
        >
          {data.phases.map((phase) => (
            <option key={phase.phaseid} value={phase.phaseid}>
              {phase.phaseorder + 1}. {phase.phaselabel}
              {phase.finished_evaluation ? " (abgeschlossen)" : ""}
            </option>
          ))}
        </select>
      </label>

      {notice && (
        <p className="rounded border border-green-300 bg-green-50 p-3 text-sm text-green-800">
          {notice}
        </p>
      )}
      {error && (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <section className="rounded-lg border border-gray-200 p-5">
        <h2 className="text-xl font-bold">1. Matching</h2>
        <p className="mt-2 text-sm text-gray-600">
          {eligibleApplications.length} Startups sind für diese Phase
          teilnahmeberechtigt. Die CSV benötigt die Spalten name, email, new und
          max.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium">
            Bewerter-CSV
            <input
              className={fieldClass}
              type="file"
              accept=".csv,text/csv"
              onChange={readCsv}
            />
          </label>
          <label className="block text-sm font-medium">
            Bewerter pro Startup
            <input
              className={fieldClass}
              type="number"
              min={1}
              max={10}
              value={reviewersPerApplication}
              onChange={(event) =>
                setReviewersPerApplication(Number(event.target.value))
              }
            />
          </label>
        </div>
        <button
          type="button"
          className="apl-button-fixed mt-4"
          disabled={!csvText || pendingAction !== ""}
          onClick={() =>
            runAction("preview", async () => {
              const result = await previewReviewerMatching(
                phaseId,
                csvText,
                reviewersPerApplication,
              );
              setPreview(result);
              return `${result.length} Zuweisungen wurden erfolgreich berechnet.`;
            })
          }
        >
          {pendingAction === "preview"
            ? "Matching wird berechnet..."
            : "Matching prüfen"}
        </button>

        {preview.length > 0 && (
          <div className="mt-5 overflow-x-auto">
            <h3 className="font-semibold">Vorschau</h3>
            <table className="mt-2 min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Startup</th>
                  <th className="px-3 py-2 text-left">Bewerter</th>
                  <th className="px-3 py-2 text-left">Erfahren</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {preview.map((assignment) => (
                  <tr
                    key={`${assignment.applicationId}-${assignment.reviewerUserId}`}
                  >
                    <td className="px-3 py-2">{assignment.teamName}</td>
                    <td className="px-3 py-2">
                      {assignment.reviewerName} ({assignment.reviewerEmail})
                    </td>
                    <td className="px-3 py-2">
                      {assignment.reviewerIsExperienced ? "Ja" : "Nein"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              className="apl-button-fixed mt-4"
              disabled={pendingAction !== ""}
              onClick={() => {
                if (
                  !window.confirm(
                    "Das bisherige Matching dieser Phase wird vollständig ersetzt. Fortfahren?",
                  )
                ) {
                  return;
                }
                runAction("save", async () => {
                  const result = await saveReviewerAssignments(
                    phaseId,
                    preview,
                  );
                  setPreview([]);
                  router.refresh();
                  return `${result.savedAssignments} Zuweisungen wurden gespeichert.`;
                });
              }}
            >
              {pendingAction === "save"
                ? "Matching wird gespeichert..."
                : "Matching verbindlich speichern"}
            </button>
          </div>
        )}

        {currentAssignments.length > 0 && preview.length === 0 && (
          <div className="mt-5">
            <h3 className="font-semibold">
              Gespeichertes Matching ({currentAssignments.length} Zuweisungen)
            </h3>
            <ul className="mt-2 space-y-1 text-sm">
              {[...currentAssignmentsByApplication.values()].map(
                (assignments) => (
                  <li key={assignments[0].applicationId}>
                    <strong>{assignments[0].teamName}:</strong>{" "}
                    {assignments
                      .map((assignment) => assignment.reviewerEmail)
                      .join(", ")}
                  </li>
                ),
              )}
            </ul>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 p-5">
        <h2 className="text-xl font-bold">2. E-Mail-Versand</h2>
        <p className="mt-2 text-sm text-gray-600">
          Die dauerhaften Standardwerte stehen in reviewEmailConfig.ts.
          Änderungen hier gelten nur für diesen Versand.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium md:col-span-2">
            Betreff
            <input
              className={fieldClass}
              value={emailSettings.subject}
              onChange={(event) =>
                updateEmailSetting("subject", event.target.value)
              }
            />
          </label>
          <label className="block text-sm font-medium">
            Bestätigungsfrist
            <input
              className={fieldClass}
              value={emailSettings.confirmationDeadline}
              onChange={(event) =>
                updateEmailSetting("confirmationDeadline", event.target.value)
              }
            />
          </label>
          <label className="block text-sm font-medium">
            Bestätigungsformular
            <input
              className={fieldClass}
              type="url"
              value={emailSettings.confirmationUrl}
              onChange={(event) =>
                updateEmailSetting("confirmationUrl", event.target.value)
              }
            />
          </label>
          <label className="block text-sm font-medium">
            Bewertungsfrist
            <input
              className={fieldClass}
              value={emailSettings.ratingDeadline}
              onChange={(event) =>
                updateEmailSetting("ratingDeadline", event.target.value)
              }
            />
          </label>
          <label className="block text-sm font-medium">
            Anleitung
            <input
              className={fieldClass}
              type="url"
              value={emailSettings.instructionsUrl}
              onChange={(event) =>
                updateEmailSetting("instructionsUrl", event.target.value)
              }
            />
          </label>
          <label className="block text-sm font-medium">
            Bewertungsformular
            <input
              className={fieldClass}
              type="url"
              value={emailSettings.ratingUrl}
              onChange={(event) =>
                updateEmailSetting("ratingUrl", event.target.value)
              }
            />
          </label>
          <label className="block text-sm font-medium md:col-span-2">
            Hinweis für diese Phase
            <textarea
              className={fieldClass}
              rows={4}
              value={emailSettings.phaseNote}
              onChange={(event) =>
                updateEmailSetting("phaseNote", event.target.value)
              }
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="apl-button-fixed"
            disabled={currentAssignments.length === 0 || pendingAction !== ""}
            onClick={() =>
              runAction("test-email", async () => {
                const result = await sendReviewerTestEmail(
                  phaseId,
                  emailSettings,
                );
                return `Testmail wurde an ${result.recipient} gesendet.`;
              })
            }
          >
            {pendingAction === "test-email"
              ? "Wird gesendet..."
              : "Testmail senden"}
          </button>
          <button
            type="button"
            className="apl-alert-button-fixed"
            disabled={currentAssignments.length === 0 || pendingAction !== ""}
            onClick={() => {
              if (
                !window.confirm(
                  "Die Zuweisungen werden jetzt produktiv an alle Bewerter dieser Phase versendet. Fortfahren?",
                )
              ) {
                return;
              }
              runAction("emails", async () => {
                const result = await sendReviewerAssignmentEmails(
                  phaseId,
                  emailSettings,
                );
                return `${result.sentEmails} E-Mails wurden versendet.`;
              });
            }}
          >
            {pendingAction === "emails"
              ? "E-Mails werden gesendet..."
              : "Produktiv an alle senden"}
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-5">
        <h2 className="text-xl font-bold">3. Entscheidungen und Abschluss</h2>
        <p className="mt-2 text-sm text-gray-600">
          Jede Entscheidung wird sofort gespeichert. Eine Phase kann erst
          abgeschlossen werden, wenn alle Startups entschieden sind.
        </p>
        {selectedPhase.finished_evaluation === null && (
          <div className="mt-4 rounded bg-gray-50 p-4">
            <label className="block text-sm font-medium">
              Liste der bestandenen E-Mail-Adressen
              <textarea
                className={fieldClass}
                rows={4}
                placeholder="team1@example.org&#10;team2@example.org"
                value={approvedEmails}
                onChange={(event) => setApprovedEmails(event.target.value)}
              />
            </label>
            <p className="mt-2 text-xs text-gray-600">
              Beim Anwenden werden alle aufgeführten Startups als bestanden und
              alle übrigen teilnahmeberechtigten Startups als nicht bestanden
              gespeichert.
            </p>
            <button
              type="button"
              className="apl-button-fixed mt-3"
              disabled={pendingAction !== ""}
              onClick={() => {
                if (
                  !window.confirm(
                    `Die Liste setzt die Entscheidung für alle ${eligibleApplications.length} Startups. Fortfahren?`,
                  )
                ) {
                  return;
                }
                runAction("bulk-decisions", async () => {
                  const result = await saveBulkPhaseDecisions(
                    phaseId,
                    approvedEmails,
                  );
                  const approvedEmailSet = new Set(
                    approvedEmails
                      .split(/[\s,;]+/)
                      .map(normalizeEmail)
                      .filter(Boolean),
                  );
                  setDecisions((current) => ({
                    ...current,
                    ...Object.fromEntries(
                      eligibleApplications.map((application) => [
                        decisionKey(phaseId, application.applicantUserId),
                        approvedEmailSet.has(normalizeEmail(application.email)),
                      ]),
                    ),
                  }));
                  router.refresh();
                  return `${result.passed} bestanden, ${result.failed} nicht bestanden.`;
                });
              }}
            >
              {pendingAction === "bulk-decisions"
                ? "Liste wird angewendet..."
                : "Liste auf alle anwenden"}
            </button>
          </div>
        )}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Startup</th>
                <th className="px-3 py-2 text-left">E-Mail</th>
                <th className="px-3 py-2 text-left">Entscheidung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {eligibleApplications.map((application) => (
                <tr key={application.applicationId}>
                  <td className="px-3 py-2">{application.teamName}</td>
                  <td className="px-3 py-2">{application.email}</td>
                  <td className="px-3 py-2">
                    <select
                      className="rounded border border-gray-300 px-2 py-1"
                      disabled={
                        selectedPhase.finished_evaluation !== null ||
                        pendingAction !== ""
                      }
                      value={
                        decisions[
                          decisionKey(phaseId, application.applicantUserId)
                        ] === undefined
                          ? ""
                          : decisions[
                                decisionKey(
                                  phaseId,
                                  application.applicantUserId,
                                )
                              ]
                            ? "passed"
                            : "failed"
                      }
                      onChange={(event) => {
                        if (!event.target.value) return;
                        const outcome = event.target.value === "passed";
                        runAction(
                          `decision-${application.applicantUserId}`,
                          async () => {
                            await savePhaseDecision(
                              phaseId,
                              application.applicantUserId,
                              outcome,
                            );
                            setDecisions((current) => ({
                              ...current,
                              [decisionKey(
                                phaseId,
                                application.applicantUserId,
                              )]: outcome,
                            }));
                            return `Entscheidung für ${application.teamName} wurde gespeichert.`;
                          },
                        );
                      }}
                    >
                      <option value="">Offen</option>
                      <option value="passed">Bestanden</option>
                      <option value="failed">Nicht bestanden</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedPhase.finished_evaluation ? (
          <p className="mt-4 font-semibold text-green-700">
            Phase abgeschlossen am {selectedPhase.finished_evaluation}
          </p>
        ) : (
          <button
            type="button"
            className="apl-alert-button-fixed mt-4"
            disabled={pendingAction !== "" || eligibleApplications.length === 0}
            onClick={() => {
              if (
                !window.confirm(
                  "Nach dem Abschluss werden die Ergebnisse für Bewerber sichtbar. Phase wirklich abschließen?",
                )
              ) {
                return;
              }
              runAction("finish", async () => {
                await finishPhaseEvaluation(phaseId);
                router.refresh();
                return "Die Phase wurde abgeschlossen.";
              });
            }}
          >
            {pendingAction === "finish"
              ? "Phase wird abgeschlossen..."
              : "Phase verbindlich abschließen"}
          </button>
        )}
      </section>
    </div>
  );
}
