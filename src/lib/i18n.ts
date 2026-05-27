export type Locale = "nl" | "en";

export const DEFAULT_LOCALE: Locale = "nl";
export const LOCALE_COOKIE = "locale";

export interface Strings {
  common: {
    home: string;
    back: string;
    next: string;
    signIn: string;
    signOut: string;
    account: string;
    admin: string;
    personalLink: string;
  };
  landing: {
    tag: string;
    headlinePre: string;
    headlineEm: string;
    sub: string;
    cta: string;
    ctaSub: string;
    noLinkTitle: string;
    noLinkBody: string;
    step1Title: string;
    step1Body: string;
    step2Title: string;
    step2Body: string;
    step3Title: string;
    step3Body: string;
  };
  newPage: {
    stepLabel: string;
    sectionLabel: string;
    generateBio: string;
    requiredHint: string;
    outputTitle: string;
    outputDescription: string;
    infoLabel: string;
  };
  resultPage: {
    adjustQuestionnaire: string;
    toneLengthTitle: string;
    toneLengthDesc: string;
    bioTitle: string;
    copy: string;
    copied: string;
    copyFailed: string;
    regenerate: string;
    writing: string;
    retry: string;
    generationFailed: string;
    noCreditsTitle: string;
    passDepletedTitle: string;
    toAccount: string;
    toHome: string;
    genericError: string;
    supplementTitle: string;
    supplementDesc: string;
    noDataTitle: string;
    noDataBody: string;
  };
  signinPage: {
    title: string;
    description: string;
    emailLabel: string;
    submit: string;
    legalNote: string;
    genericError: string;
  };
  checkInbox: {
    title: string;
    desc: string;
    body: string;
    useOther: string;
  };
  expired: {
    depletedTitle: string;
    depletedBody: string;
    unknownTitle: string;
    unknownBody: string;
    backHome: string;
  };
  apiErrors: {
    noCredits: string;
    passDepleted: string;
    noAccess: string;
    notSignedIn: string;
    invalidRequest: string;
    unknown: string;
    configMissing: string;
  };
}

export const STRINGS: Record<Locale, Strings> = {
  nl: {
    common: {
      home: "Home",
      back: "Terug",
      next: "Volgende",
      signIn: "Inloggen",
      signOut: "Uitloggen",
      account: "Account",
      admin: "Admin",
      personalLink: "Persoonlijke link",
    },
    landing: {
      tag: "AI-gestuurde kunstenaarsbiografie",
      headlinePre: "Jouw verhaal verdient meer dan een",
      headlineEm: "LinkedIn-bio.",
      sub: "ArtistBio zet een paar gerichte antwoorden om in een verzorgde, professionele biografie voor beeldend kunstenaars en muzikanten — klaar voor galeries, festivals, persdossiers en je eigen site.",
      cta: "Start je bio",
      ctaSub: "Klaar in enkele minuten",
      noLinkTitle: "Heb je een persoonlijke link?",
      noLinkBody:
        "Open de link die je van het artnomad-collectief hebt gekregen om te beginnen. Geen link? Stuur ons een bericht.",
      step1Title: "Vul de vragenlijst in",
      step1Body: "Zes korte secties over je werk, achtergrond en carrière. Tussentijds bewaard.",
      step2Title: "Laat de AI schrijven",
      step2Body: "Een professionele biografie in jouw gekozen toon, lengte, taal en perspectief.",
      step3Title: "Verfijn en gebruik",
      step3Body: "Pas toon of lengte aan, kopieer of download als .txt — klaar voor je site of persdossier.",
    },
    newPage: {
      stepLabel: "Stap {n} van {total}",
      sectionLabel: "Sectie",
      generateBio: "Genereer bio",
      requiredHint:
        "Verplichte velden zijn gemarkeerd met *. De rest is optioneel — de biografie vult ontbrekende delen niet zelf in, maar geeft aan wat nog ontbreekt.",
      outputTitle: "Output-instellingen",
      outputDescription:
        "Bepaal hoe de biografie klinkt. Je kunt dit later op de resultaatpagina nog aanpassen.",
      infoLabel: "Meer info",
    },
    resultPage: {
      adjustQuestionnaire: "Vragenlijst aanpassen",
      toneLengthTitle: "Toon & lengte",
      toneLengthDesc: "Wijzig een instelling om de biografie opnieuw te genereren.",
      bioTitle: "Biografie",
      copy: "Kopiëren",
      copied: "Biografie gekopieerd.",
      copyFailed: "Kopiëren niet gelukt.",
      regenerate: "Regenereren",
      writing: "Biografie wordt geschreven…",
      retry: "Opnieuw proberen",
      generationFailed: "Genereren mislukt",
      noCreditsTitle: "Geen credits meer",
      passDepletedTitle: "Link is op",
      toAccount: "Naar je account",
      toHome: "Naar de homepage",
      genericError: "Er ging iets mis. Probeer het opnieuw.",
      supplementTitle: "Aanvulling gewenst",
      supplementDesc: "Met deze informatie wordt de biografie completer.",
      noDataTitle: "Nog geen gegevens",
      noDataBody: "Vul eerst de vragenlijst in om een biografie te genereren.",
    },
    signinPage: {
      title: "Inloggen of registreren",
      description: "Vul je e-mailadres in. We sturen je een magic link om in te loggen.",
      emailLabel: "E-mailadres",
      submit: "Stuur magic link",
      legalNote: "Door door te gaan ga je akkoord met het gebruik van ArtistBio.",
      genericError: "Er ging iets mis. Probeer het opnieuw.",
    },
    checkInbox: {
      title: "Check je inbox",
      desc: "We hebben je een inloglink gestuurd. Open de e-mail om door te gaan.",
      body:
        "Klik op de link in de e-mail om door te gaan naar ArtistBio. Geen e-mail ontvangen? Check je spam-map.",
      useOther: "Andere e-mail gebruiken",
    },
    expired: {
      depletedTitle: "Link is op",
      depletedBody:
        "Deze persoonlijke link is al gebruikt. Vraag het artnomad-collectief om een nieuwe.",
      unknownTitle: "Link werkt niet",
      unknownBody:
        "We konden deze link niet vinden. Controleer of je de juiste link hebt gekopieerd.",
      backHome: "Terug naar de homepage",
    },
    apiErrors: {
      noCredits: "Je hebt geen credits meer. Koop credits om door te gaan.",
      passDepleted:
        "Je persoonlijke link is op. Vraag het collectief om een nieuwe.",
      noAccess: "Geen toegang. Open je persoonlijke link of log in.",
      notSignedIn: "Niet ingelogd.",
      invalidRequest: "Ongeldige aanvraag.",
      unknown: "Onbekende fout bij het genereren.",
      configMissing: "Serverconfiguratie ontbreekt: ANTHROPIC_API_KEY is niet ingesteld.",
    },
  },
  en: {
    common: {
      home: "Home",
      back: "Back",
      next: "Next",
      signIn: "Sign in",
      signOut: "Sign out",
      account: "Account",
      admin: "Admin",
      personalLink: "Personal link",
    },
    landing: {
      tag: "AI-driven artist biography",
      headlinePre: "Your story deserves more than a",
      headlineEm: "LinkedIn bio.",
      sub: "ArtistBio turns a few focused answers into a polished, professional biography for visual artists and musicians — ready for galleries, festivals, press kits, and your own site.",
      cta: "Start your bio",
      ctaSub: "Ready in a few minutes",
      noLinkTitle: "Do you have a personal link?",
      noLinkBody:
        "Open the link you received from the artnomad collective to begin. No link? Drop us a message.",
      step1Title: "Fill out the questionnaire",
      step1Body: "Six short sections about your work, background, and career. Saved as you go.",
      step2Title: "Let the AI write",
      step2Body: "A professional biography in the tone, length, language, and perspective you choose.",
      step3Title: "Refine and use",
      step3Body: "Adjust tone or length, copy or download as .txt — ready for your site or press kit.",
    },
    newPage: {
      stepLabel: "Step {n} of {total}",
      sectionLabel: "Section",
      generateBio: "Generate bio",
      requiredHint:
        "Required fields are marked with *. The rest is optional — the bio won't fill in missing parts itself, but will flag what's still missing.",
      outputTitle: "Output settings",
      outputDescription:
        "Decide how the biography should sound. You can change this later on the result page.",
      infoLabel: "More info",
    },
    resultPage: {
      adjustQuestionnaire: "Edit questionnaire",
      toneLengthTitle: "Tone & length",
      toneLengthDesc: "Change a setting to regenerate the biography.",
      bioTitle: "Biography",
      copy: "Copy",
      copied: "Biography copied.",
      copyFailed: "Couldn't copy.",
      regenerate: "Regenerate",
      writing: "Writing the biography…",
      retry: "Try again",
      generationFailed: "Generation failed",
      noCreditsTitle: "Out of credits",
      passDepletedTitle: "Link used up",
      toAccount: "Go to your account",
      toHome: "Go to the homepage",
      genericError: "Something went wrong. Please try again.",
      supplementTitle: "Suggested additions",
      supplementDesc: "Adding this information would make the biography more complete.",
      noDataTitle: "No data yet",
      noDataBody: "Fill in the questionnaire first to generate a biography.",
    },
    signinPage: {
      title: "Sign in or sign up",
      description: "Enter your email. We'll send you a magic link to sign in.",
      emailLabel: "Email address",
      submit: "Send magic link",
      legalNote: "By continuing you agree to the use of ArtistBio.",
      genericError: "Something went wrong. Please try again.",
    },
    checkInbox: {
      title: "Check your inbox",
      desc: "We've sent you a sign-in link. Open the email to continue.",
      body:
        "Click the link in the email to continue to ArtistBio. No email? Check your spam folder.",
      useOther: "Use a different email",
    },
    expired: {
      depletedTitle: "Link used up",
      depletedBody:
        "This personal link has already been used. Ask the artnomad collective for a new one.",
      unknownTitle: "Link doesn't work",
      unknownBody:
        "We couldn't find this link. Check that you've copied the correct URL.",
      backHome: "Back to the homepage",
    },
    apiErrors: {
      noCredits: "You're out of credits. Buy credits to continue.",
      passDepleted:
        "Your personal link is used up. Ask the collective for a new one.",
      noAccess: "No access. Open your personal link or sign in.",
      notSignedIn: "Not signed in.",
      invalidRequest: "Invalid request.",
      unknown: "Unknown error while generating.",
      configMissing: "Server configuration missing: ANTHROPIC_API_KEY is not set.",
    },
  },
};

export function normalizeLocale(input: string | null | undefined): Locale {
  return input === "en" ? "en" : "nl";
}
