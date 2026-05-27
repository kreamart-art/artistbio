import { getLocale, getStrings } from "@/lib/get-locale";

import { NewForm } from "./new-form";

export default function NewPage() {
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
    <NewForm
      locale={locale}
      strings={strings.newPage}
      common={strings.common}
      settingsLabels={settingsLabels}
    />
  );
}
