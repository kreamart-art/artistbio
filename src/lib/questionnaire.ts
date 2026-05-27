import type { Locale } from "@/lib/i18n";
import type { Language, Length, Perspective, Tone } from "@/lib/types";

export type FieldType = "text" | "textarea";

type I18nText = { nl: string; en: string };

export interface Field {
  id: string;
  label: I18nText;
  type: FieldType;
  placeholder?: I18nText;
  hint?: I18nText;
  info?: I18nText;
  required?: boolean;
}

export interface Section {
  id: string;
  key: string;
  title: I18nText;
  description: I18nText;
  fields: Field[];
}

export const SECTIONS: Section[] = [
  {
    id: "basis",
    key: "A",
    title: { nl: "Basis", en: "Basics" },
    description: {
      nl: "Wie ben je en in welke discipline werk je?",
      en: "Who are you and in which discipline do you work?",
    },
    fields: [
      {
        id: "naam",
        type: "text",
        required: true,
        label: { nl: "Naam of artiestennaam", en: "Name or artist name" },
        placeholder: { nl: "bv. Amira Bloom", en: "e.g. Amira Bloom" },
        info: {
          nl: "Hoe wil je in de biografie genoemd worden? Mag je volledige naam, een artiestennaam, of allebei.",
          en: "How do you want to be named in the biography? Full name, artist name, or both.",
        },
      },
      {
        id: "discipline",
        type: "text",
        required: true,
        label: { nl: "Discipline", en: "Discipline" },
        placeholder: {
          nl: "beeldend kunstenaar, muzikant, of beide",
          en: "visual artist, musician, or both",
        },
        hint: {
          nl: "Bepaalt de toon en terminologie van de biografie.",
          en: "Sets the tone and vocabulary of the biography.",
        },
        info: {
          nl: "Het vakgebied waarin je werkt — bepaalt het vocabulaire van de biografie (galerie-taal vs. festival-taal).",
          en: "The field you work in — drives the vocabulary of the biography (gallery talk vs. festival talk).",
        },
      },
      {
        id: "locatie",
        type: "text",
        label: { nl: "Standplaats", en: "Base" },
        placeholder: {
          nl: "bv. Rotterdam, Nederland",
          en: "e.g. Rotterdam, Netherlands",
        },
        info: {
          nl: "Waar je woont of werkt. Veel curatoren en programmeurs noemen dit. Mag stad + land of alleen stad.",
          en: "Where you live or work. Many curators and programmers include this. City + country, or city only.",
        },
      },
      {
        id: "geboorte",
        type: "text",
        label: { nl: "Geboortejaar / -plaats", en: "Year / place of birth" },
        placeholder: { nl: "bv. 1991, Antwerpen", en: "e.g. 1991, Antwerp" },
        info: {
          nl: "Optioneel. Sommige instituten en festivals verwachten dit; voor anderen is het niet relevant.",
          en: "Optional. Some institutions and festivals expect this; for others it isn't relevant.",
        },
      },
      {
        id: "aanspreekvorm",
        type: "text",
        label: { nl: "Aanspreekvorm", en: "Pronouns" },
        placeholder: { nl: "bv. zij/haar, hij/hem, hen/hun", en: "e.g. she/her, he/him, they/them" },
        info: {
          nl: "De voornaamwoorden die in de biografie gebruikt moeten worden.",
          en: "The pronouns to use in the biography.",
        },
      },
    ],
  },
  {
    id: "werk",
    key: "B",
    title: { nl: "Werk", en: "Work" },
    description: {
      nl: "Wat maak je en hoe ziet het eruit?",
      en: "What do you make and what does it look (or sound) like?",
    },
    fields: [
      {
        id: "medium",
        type: "textarea",
        required: true,
        label: { nl: "Medium, technieken of instrumenten", en: "Medium, techniques, or instruments" },
        placeholder: {
          nl: "bv. olieverf en collage / elektronische productie, analoge synths, zang",
          en: "e.g. oil paint and collage / electronic production, analogue synths, vocals",
        },
        info: {
          nl: "Materiaal of techniek waarmee je werkt. Voor muziek: instrumenten, software, zang.",
          en: "The material or technique you work with. For music: instruments, software, vocals.",
        },
      },
      {
        id: "stijl",
        type: "textarea",
        label: { nl: "Stijl en esthetiek", en: "Style and aesthetic" },
        placeholder: {
          nl: "Hoe zou je je signatuur of klank omschrijven?",
          en: "How would you describe your signature or sound?",
        },
        info: {
          nl: "De visuele of auditieve handtekening van je werk — hoe iemand het zou herkennen of beschrijven.",
          en: "The visual or sonic signature of your work — how someone would recognise or describe it.",
        },
      },
      {
        id: "themas",
        type: "textarea",
        label: { nl: "Thema's en onderwerpen", en: "Themes and subjects" },
        placeholder: {
          nl: "Welke ideeën, vragen of motieven keren terug in je werk?",
          en: "Which ideas, questions, or motifs recur in your work?",
        },
        info: {
          nl: "Onderwerpen waar je werk inhoudelijk over gaat — bv. identiteit, herinnering, klimaat, ritme, taal.",
          en: "The subjects your work is about — e.g. identity, memory, climate, rhythm, language.",
        },
      },
      {
        id: "kernwerk",
        type: "textarea",
        label: { nl: "Kenmerkend werk of project", en: "Signature work or project" },
        placeholder: {
          nl: "Beschrijf één werk, album of serie die je praktijk goed vat.",
          en: "Describe one work, album, or series that captures your practice well.",
        },
        info: {
          nl: "Eén specifiek werk of project dat een goede ingang biedt om je praktijk te begrijpen.",
          en: "One specific work or project that's a good entry point into your practice.",
        },
      },
    ],
  },
  {
    id: "achtergrond",
    key: "C",
    title: { nl: "Achtergrond", en: "Background" },
    description: {
      nl: "Waar komt je praktijk vandaan?",
      en: "Where does your practice come from?",
    },
    fields: [
      {
        id: "opleiding",
        type: "textarea",
        label: { nl: "Opleiding", en: "Education" },
        placeholder: {
          nl: "Academies, conservatoria, diploma's, jaartallen.",
          en: "Academies, conservatories, degrees, years.",
        },
        info: {
          nl: "Formele opleidingen met naam, plaats en jaartallen. Autodidact mag ook expliciet genoemd worden.",
          en: "Formal education with name, location, and years. Self-taught can be stated explicitly as well.",
        },
      },
      {
        id: "invloeden",
        type: "textarea",
        label: { nl: "Invloeden en mentoren", en: "Influences and mentors" },
        placeholder: {
          nl: "Kunstenaars, docenten, scenes of tradities die je vormden.",
          en: "Artists, teachers, scenes, or traditions that shaped you.",
        },
        info: {
          nl: "Mensen, scenes of tradities die je vorming hebben gestuurd. Mag breed: artiesten, denkers, plekken.",
          en: "People, scenes, or traditions that shaped your formation. Can be broad: artists, thinkers, places.",
        },
      },
      {
        id: "oorsprong",
        type: "textarea",
        label: { nl: "Hoe het begon", en: "How it started" },
        placeholder: {
          nl: "Het keerpunt of de aanleiding om hieraan te beginnen.",
          en: "The turning point or reason you began.",
        },
        info: {
          nl: "Het moment, de aanleiding of het keerpunt waardoor je naar deze praktijk bent gekomen.",
          en: "The moment, occasion, or turning point that led you to this practice.",
        },
      },
    ],
  },
  {
    id: "carriere",
    key: "D",
    title: { nl: "Carrière", en: "Career" },
    description: {
      nl: "Wat heb je tot nu toe gedaan en bereikt?",
      en: "What have you done and achieved so far?",
    },
    fields: [
      {
        id: "exposities",
        type: "textarea",
        label: { nl: "Exposities of optredens", en: "Exhibitions or performances" },
        placeholder: {
          nl: "Belangrijkste shows, festivals of concerten — met locatie en jaartal.",
          en: "Key shows, festivals, or concerts — with location and year.",
        },
        info: {
          nl: "Belangrijkste publieke momenten van je werk. Verzin niets — gebruik alleen wat klopt, met locatie en jaartal indien bekend.",
          en: "Key public moments of your work. Don't invent anything — use only what's accurate, with location and year if known.",
        },
      },
      {
        id: "prijzen",
        type: "textarea",
        label: { nl: "Prijzen, beurzen en residenties", en: "Awards, grants, and residencies" },
        placeholder: {
          nl: "Onderscheidingen, subsidies, residentieprogramma's.",
          en: "Awards, grants, residency programmes.",
        },
        info: {
          nl: "Formele erkenningen: prijzen, beurzen, subsidies, residentieprogramma's.",
          en: "Formal recognitions: awards, grants, subsidies, residency programmes.",
        },
      },
      {
        id: "pers",
        type: "textarea",
        label: { nl: "Publicaties en pers", en: "Publications and press" },
        placeholder: {
          nl: "Recensies, interviews, catalogi, releases.",
          en: "Reviews, interviews, catalogues, releases.",
        },
        info: {
          nl: "Waar over je werk geschreven is — recensies, interviews, catalogi, platenrecensies.",
          en: "Where your work has been written about — reviews, interviews, catalogues, record reviews.",
        },
      },
      {
        id: "netwerk",
        type: "textarea",
        label: { nl: "Collecties, galeries of labels", en: "Collections, galleries, or labels" },
        placeholder: {
          nl: "Vertegenwoordiging, collecties, platenlabels, samenwerkingen.",
          en: "Representation, collections, record labels, collaborations.",
        },
        info: {
          nl: "Galeries die je vertegenwoordigen, labels waarop je uitbrengt, collectieven waar je deel van bent.",
          en: "Galleries that represent you, labels you release on, collectives you're part of.",
        },
      },
    ],
  },
  {
    id: "heden",
    key: "E",
    title: { nl: "Heden", en: "Present" },
    description: {
      nl: "Waar sta je nu en waar ga je naartoe?",
      en: "Where are you now and where are you headed?",
    },
    fields: [
      {
        id: "huidig",
        type: "textarea",
        label: { nl: "Huidige projecten", en: "Current projects" },
        placeholder: {
          nl: "Waar werk je op dit moment aan?",
          en: "What are you working on right now?",
        },
        info: {
          nl: "Waar je nu mee bezig bent — kan een serie, een opdracht, een tour, of onderzoek zijn.",
          en: "What you're currently making — a series, a commission, a tour, or research.",
        },
      },
      {
        id: "komend",
        type: "textarea",
        label: { nl: "Recente of komende events", en: "Recent or upcoming events" },
        placeholder: {
          nl: "Aankomende releases, exposities of optredens.",
          en: "Upcoming releases, exhibitions, or performances.",
        },
        info: {
          nl: "Aankomende of recente publieke momenten — releases, exposities, optredens.",
          en: "Upcoming or recent public moments — releases, exhibitions, performances.",
        },
      },
      {
        id: "ambitie",
        type: "textarea",
        label: { nl: "Richting en ambities", en: "Direction and ambitions" },
        placeholder: {
          nl: "Waar beweegt je werk naartoe?",
          en: "Where is your work headed?",
        },
        info: {
          nl: "Waar je werk naartoe wil. Welke vragen wil je verkennen of welk werk wil je in de komende jaren maken?",
          en: "Where your work is going. What questions do you want to explore, or what work do you want to make in the coming years?",
        },
      },
      {
        id: "links",
        type: "text",
        label: { nl: "Website en socials", en: "Website and socials" },
        placeholder: {
          nl: "bv. amirabloom.com, @amirabloom",
          en: "e.g. amirabloom.com, @amirabloom",
        },
        info: {
          nl: "Officiële kanalen waar je werk te vinden is — website, Instagram, Bandcamp, etc.",
          en: "Official channels where your work can be found — website, Instagram, Bandcamp, etc.",
        },
      },
    ],
  },
];

export const LANGUAGE_OPTIONS: { value: Language; label: I18nText }[] = [
  { value: "nl", label: { nl: "Nederlands", en: "Dutch" } },
  { value: "en", label: { nl: "Engels", en: "English" } },
  { value: "de", label: { nl: "Duits", en: "German" } },
  { value: "fr", label: { nl: "Frans", en: "French" } },
];

export const LENGTH_OPTIONS: { value: Length; label: I18nText }[] = [
  { value: "kort", label: { nl: "Kort", en: "Short" } },
  { value: "middel", label: { nl: "Middel", en: "Medium" } },
  { value: "lang", label: { nl: "Lang", en: "Long" } },
];

export const TONE_OPTIONS: { value: Tone; label: I18nText }[] = [
  { value: "formeel", label: { nl: "Formeel", en: "Formal" } },
  { value: "kritisch", label: { nl: "Kritisch", en: "Critical" } },
  { value: "warm", label: { nl: "Warm", en: "Warm" } },
  { value: "speels", label: { nl: "Speels", en: "Playful" } },
];

export const PERSPECTIVE_OPTIONS: {
  value: Perspective;
  label: I18nText;
}[] = [
  { value: "derde", label: { nl: "Derde persoon", en: "Third person" } },
  { value: "eerste", label: { nl: "Eerste persoon", en: "First person" } },
];

/** Helper voor render-time: kies de juiste taal uit een tweetalig veld. */
export function t(text: I18nText | undefined, locale: Locale): string {
  if (!text) return "";
  return text[locale] ?? text.nl;
}

/** Alle veld-ids met hun (NL) label, voor het opbouwen van het promptbericht. */
export const FIELD_LABELS: Record<string, { section: string; label: string }> =
  Object.fromEntries(
    SECTIONS.flatMap((s) =>
      s.fields.map((f) => [
        f.id,
        { section: `${s.key} · ${s.title.nl}`, label: f.label.nl },
      ]),
    ),
  );
