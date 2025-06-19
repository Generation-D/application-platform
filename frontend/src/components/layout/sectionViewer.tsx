"use client";
import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { ExtendedAnswerType } from "@/actions/answers/answers";
import { PhaseData, SectionData } from "@/store/slices/phaseSlice";

import Questionnaire, { Question } from "../questions";

export type SectionQuestionsMap = {
  [key: string]: Question[];
};

export function SectionView({
  phaseData,
  mapQuestions,
  phaseAnswers,
  phaseSections,
  iseditable,
}: {
  phaseData: PhaseData;
  mapQuestions: SectionQuestionsMap;
  phaseAnswers: ExtendedAnswerType[];
  phaseSections: SectionData[];
  iseditable: boolean;
}) {
  const searchParams = useSearchParams();

  const sortedSections = phaseSections.sort(
    (a, b) => a.sectionorder - b.sectionorder,
  );

  // Helper function to safely get the URL parameter
  const getUrlIndex = (): string | null => {
    return searchParams.get("sec");
  };

  // Initial state setup with URL parameter
  const [selectedSection, setSelectedSection] = useState<string>(() => {
    const urlIndex = parseInt(getUrlIndex() ?? "0", 10) - 1;
    const validIndex = urlIndex >= 0 && urlIndex < sortedSections.length;
    return validIndex
      ? sortedSections[urlIndex].sectionid
      : (sortedSections[0]?.sectionid ?? "");
  });

  // Update URL when the section changes
  const setSelectedSectionWithUrl = (sectionId: string) => {
    const index = sortedSections.findIndex(
      (section) => section.sectionid === sectionId,
    );
    if (index !== -1) {
      setSelectedSection(sectionId);
      const newUrl = `${window.location.pathname}?sec=${index + 1}`;
      history.pushState(null, "", newUrl);
    }
  };

  // Handle URL changes
  useEffect(() => {
    const handleRouteChange = () => {
      const urlIndex = parseInt(getUrlIndex() ?? "0", 10) - 1;
      if (urlIndex >= 0 && urlIndex < sortedSections.length) {
        setSelectedSectionWithUrl(sortedSections[urlIndex].sectionid);
      }
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [sortedSections]);

  const moveToNextSection = () => {
    const currentIndex = sortedSections.findIndex(
      (section) => section.sectionid === selectedSection,
    );
    const nextIndex = currentIndex + 1;
    if (nextIndex < sortedSections.length) {
      setSelectedSectionWithUrl(sortedSections[nextIndex].sectionid);
    }
  };

  const moveToPreviousSection = () => {
    const currentIndex = sortedSections.findIndex(
      (section) => section.sectionid === selectedSection,
    );
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setSelectedSectionWithUrl(sortedSections[prevIndex].sectionid);
    }
  };

  const currentIndex = sortedSections.findIndex(
    (section) => section.sectionid === selectedSection,
  );

  const nextSectionName =
    currentIndex < sortedSections.length - 1
      ? sortedSections[currentIndex + 1].sectionname
      : null;

  const prevSectionName =
    currentIndex > 0 ? sortedSections[currentIndex - 1].sectionname : null;

  const isNotFirstSection = currentIndex > 0;
  const isNotLastSection = currentIndex < sortedSections.length - 1;

  return (
    <div className="text-sm font-medium text-gray-500 border-gray-200 mt-7 mb-7">
      <ul className="flex flex-wrap -mb-px rounded-t-lg border-b">
        {sortedSections.map((phaseSection, index) => {
          const isFirstButton = index === 0;
          const isLastButton = index === sortedSections.length - 1;
          return (
            <button
              type="button"
              key={phaseSection.sectionid}
              className={`flex-1 py-2 px-4 border-b-secondary hover:bg-gray-200 hover:text-secondary ${
                selectedSection === phaseSection.sectionid
                  ? "text-secondary border-b-2"
                  : "text-gray-500"
              } ${isFirstButton ? "rounded-tl-lg" : ""} ${
                isLastButton ? "rounded-tr-lg" : ""
              }`}
              onClick={() => setSelectedSectionWithUrl(phaseSection.sectionid)}
            >
              {phaseSection.sectionname}
            </button>
          );
        })}
      </ul>
      {sortedSections.map((phaseSection) => {
        const isVisible = selectedSection === phaseSection.sectionid;
        phaseSection.sectionname;
        return (
          <div
            key={phaseSection.sectionid}
            className={`p-4 mt-4 ${isVisible ? "visible" : "hidden"}`}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: phaseSection.sectiondescription,
              }}
              className="w-full"
            />
            <Questionnaire
              phaseData={phaseData}
              phaseQuestions={mapQuestions[phaseSection.sectionid]}
              phaseAnswers={phaseAnswers}
              iseditable={iseditable}
              selectedSection={selectedSection}
              selectedCondChoice={null}
            />
            <div className="flex justify-between mt-4">
              {isNotFirstSection ? (
                <button
                  type="button"
                  onClick={moveToPreviousSection}
                  className="py-2 px-4 text-primary bg-secondary hover:bg-secondary rounded"
                >
                  Zurück zu &quot;{prevSectionName}&quot;
                </button>
              ) : (
                <div className="py-2 px-4"></div>
              )}
              {isNotLastSection ? (
                <button
                  type="button"
                  onClick={moveToNextSection}
                  className="py-2 px-4 text-primary bg-secondary hover:bg-secondary rounded"
                >
                  Weiter zu &quot;{nextSectionName}&quot;
                </button>
              ) : (
                <div className="py-2 px-4"></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
