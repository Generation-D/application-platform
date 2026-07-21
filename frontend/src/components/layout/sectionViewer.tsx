"use client";
import { useMemo } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  applicationid,
}: {
  phaseData: PhaseData;
  mapQuestions: SectionQuestionsMap;
  phaseAnswers: ExtendedAnswerType[];
  phaseSections: SectionData[];
  iseditable: boolean;
  applicationid: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 1. Memoize sorting so it doesn't trigger recalculations on every parent render
  const sortedSections = useMemo(() => {
    return [...phaseSections].sort((a, b) => a.sectionorder - b.sectionorder);
  }, [phaseSections]);

  // 2. Derive state directly from URL (No useState or useEffect needed for selection)
  const urlSecParam = searchParams.get("sec");
  const urlIndex = parseInt(urlSecParam ?? "1", 10) - 1;

  // Ensure the index is within bounds, otherwise default to first section
  const activeIndex =
    urlIndex >= 0 && urlIndex < sortedSections.length ? urlIndex : 0;
  const selectedSection = sortedSections[activeIndex]?.sectionid ?? "";

  // 3. Navigation helper using Next.js Router
  const navigateToSection = (index: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sec", (index + 1).toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const setSelectedSectionWithUrl = (sectionId: string) => {
    const index = sortedSections.findIndex((s) => s.sectionid === sectionId);
    if (index !== -1) navigateToSection(index);
  };

  // 4. Clean helper logic for the UI
  const moveToNextSection = () => {
    if (activeIndex < sortedSections.length - 1) {
      navigateToSection(activeIndex + 1);
    }
  };

  const moveToPreviousSection = () => {
    if (activeIndex > 0) {
      navigateToSection(activeIndex - 1);
    }
  };

  const nextSectionName = sortedSections[activeIndex + 1]?.sectionname || null;
  const prevSectionName = sortedSections[activeIndex - 1]?.sectionname || null;

  const isNotFirstSection = activeIndex > 0;
  const isNotLastSection = activeIndex < sortedSections.length - 1;

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
              className={`flex-1 py-2 px-4 border-b-secondary hover:bg-gray-200 hover:text-secondary cursor-pointer ${
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
        // phaseSection.sectionname;
        if (!isVisible) {
          return null;
        }
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
              applicationid={applicationid}
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
                  className="py-2 px-4 text-primary bg-secondary hover:bg-secondary rounded cursor-pointer"
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
                  className="py-2 px-4 text-primary bg-secondary hover:bg-secondary rounded cursor-pointer"
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
