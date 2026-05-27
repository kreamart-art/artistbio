import { getLocale, getStrings } from "@/lib/get-locale";

import { ResultView } from "./result-view";

export default function ResultPage() {
  const locale = getLocale();
  const strings = getStrings();
  const settingsLabels =
    locale === "en"
      ? {
          language: "Language",
          length: "Length",
          tone: "Tone",
          perspective: "Perspective",
        }
      : {
          language: "Taal",
          length: "Lengte",
          tone: "Toon",
          perspective: "Perspectief",
        };

  return (
    <ResultView
      locale={locale}
      strings={strings.resultPage}
      settingsLabels={settingsLabels}
    />
  );
}
