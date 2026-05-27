import { cookies } from "next/headers";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  STRINGS,
  type Locale,
  type Strings,
  normalizeLocale,
} from "@/lib/i18n";

/** Server-side: lees de actieve locale uit de cookie. */
export function getLocale(): Locale {
  const raw = cookies().get(LOCALE_COOKIE)?.value;
  return normalizeLocale(raw);
}

/** Server-side: pak de juiste vertaal-strings voor de actieve locale. */
export function getStrings(): Strings {
  return STRINGS[getLocale()];
}

/** Server-side: vertaal-strings voor een specifieke locale (handig in API routes). */
export function stringsFor(locale: Locale): Strings {
  return STRINGS[locale] ?? STRINGS[DEFAULT_LOCALE];
}
