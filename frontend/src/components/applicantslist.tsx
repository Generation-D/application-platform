"use client";

import { useEffect, useState } from "react";

import {
  ApplicantsStatus,
  finishEvaluationOfPhase,
  saveApplicationOutcome,
  userData,
} from "@/actions/admin";
import { PhaseData } from "@/store/slices/phaseSlice";
import { supabase } from "@/supabase-utils/browserClient";

import ToggleSwitch from "./fields/toggleswitch";
import { SubmitButton } from "./submitButton";

export type ApplicantsStateType = {
  [questionid: string]: {
    [userid: string]: {
      status: ApplicantsStatus | undefined;
      reviewer: userData | undefined;
    };
  };
};

const ApplicantsList: React.FC<{
  users: userData[];
  phases: PhaseData[];
  applicantsStatus: ApplicantsStatus[];
}> = ({ users, phases, applicantsStatus }) => {
  const [currentAdminId, setCurrentAdminId] = useState<string>("");
  const [applicantsState, setApplicantsState] = useState<ApplicantsStateType>(
    {},
  );
  let renderedUnfinishedPhase = false;
  useEffect(() => {
    async function loadAnswer() {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error(userError);
      }
      setCurrentAdminId(user?.user?.id || "");
    }
    loadAnswer();
  });

  useEffect(() => {
    const newState: ApplicantsStateType = {};
    phases.forEach((phase) => {
      newState[phase.phaseid] = {};
      users.forEach((user) => {
        const applicantStatus = applicantsStatus.find(
          (status) =>
            status.phase_id === phase.phaseid && status.user_id === user.id,
        );
        const reviewer = users.find(
          (reviewer) => reviewer.id === applicantStatus?.reviewed_by,
        );

        newState[phase.phaseid][user.id] = {
          status: applicantStatus,
          reviewer: reviewer,
        };
      });
    });
    setApplicantsState(newState);
  }, [applicantsStatus, phases, users]);

  const handleToggle = async (
    phase_id: string,
    user_id: string,
    applicantStatus: ApplicantsStatus | undefined,
  ) => {
    await saveApplicationOutcome(
      phase_id,
      user_id,
      applicantStatus,
      currentAdminId,
    );

    setApplicantsState((prevState) => {
      const currentPhaseState = prevState[phase_id] ?? {};
      const currentUserState = currentPhaseState[user_id] ?? {
        status: undefined,
        reviewer: undefined,
      };
      const newStatus = currentUserState.status
        ? {
            ...currentUserState.status,
            outcome: !currentUserState.status.outcome,
          }
        : {
            outcome_id: "",
            phase_id: phase_id,
            user_id: user_id,
            outcome: true,
            reviewed_by: "",
            review_date: "",
          };

      return {
        ...prevState,
        [phase_id]: {
          ...currentPhaseState,
          [user_id]: {
            status: newStatus,
            reviewer: currentUserState.reviewer,
          },
        },
      };
    });
  };

  return (
    <div className="overflow-x-auto">
      {phases.map((phase, index) => {
        const isFirstPhase = index === 0;
        const previousPhaseId = index > 0 ? phases[index - 1].phaseid : null;
        if (phase.finished_evaluation !== null || !renderedUnfinishedPhase) {
          if (phase.finished_evaluation === null) {
            renderedUnfinishedPhase = true;
          }
          return (
            <div key={phase.phaseid}>
              <h3 className="text-l font-bold mb-4 mt-7">{phase.phaselabel}</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Passed Phase?
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviewed by
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => {
                    if (user.userrole > 1) {
                      return null;
                    }

                    const currentPhaseApplicantState = applicantsState[
                      phase.phaseid
                    ]
                      ? applicantsState[phase.phaseid][user.id]
                      : { status: undefined, reviewer: undefined };
                    const previousPhaseApplicantState =
                      previousPhaseId && applicantsState[previousPhaseId]
                        ? applicantsState[previousPhaseId][user.id]
                        : { status: undefined, reviewer: undefined };

                    const shouldRenderUser =
                      isFirstPhase ||
                      previousPhaseApplicantState.status?.outcome;

                    return shouldRenderUser ? (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <ToggleSwitch
                            isActive={
                              currentPhaseApplicantState.status !== undefined
                                ? currentPhaseApplicantState!.status!.outcome
                                : false
                            }
                            onClick={() =>
                              handleToggle(
                                phase.phaseid,
                                user.id,
                                currentPhaseApplicantState.status,
                              )
                            }
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {currentPhaseApplicantState?.reviewer !== undefined
                            ? currentPhaseApplicantState?.reviewer.email
                            : ""}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {currentPhaseApplicantState?.status !== undefined
                            ? currentPhaseApplicantState?.status.review_date
                            : ""}
                        </td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
              {!phase.finished_evaluation && (
                <div className="mt-5 flex justify-end">
                  <SubmitButton
                    text={"Finish Evaluation"}
                    expanded={false}
                    onClick={() =>
                      finishEvaluationOfPhase(
                        phase.phaseid,
                        users,
                        applicantsState,
                        previousPhaseId,
                        isFirstPhase,
                        currentAdminId,
                      )
                    }
                  />
                </div>
              )}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default ApplicantsList;
