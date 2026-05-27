import type { Language, Length, Perspective, Tone } from "@/lib/types";

export type FieldType = "text" | "textarea";

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
  info?: string;
  required?: boolean;
}

export interface Section {
  id: string;
  /** Letterprefix uit de opdracht, bv. "A". */
  key: string;
  title: string;
  description: string;
  fields: Field[];
}

/**
 * Secties A t/m E bevatten de vrije antwoorden. Sectie F (output-instellingen)
 * wordt apart afgehandeld via de OutputSettings-selecties.
 */
export const SECTIONS: Section[] = [
  {
    id: "basis",
    key: "A",
    title: "Basis",
    description: "Wie ben je en in welke discipline werk je?",
    fields: [
      {
        id: "naam",
        label: "Naam of artiestennaam",
        type: "text",
        placeholder: "bv. Amira Bloom",
        info: "Hoe wil je in de biografie genoemd worden? Mag je volledige naam, een artiestennaam, of allebei.",
        required: true,
      },
      {
        id: "discipline",
        label: "Discipline",
        type: "text",
        placeholder: "beeldend kunstenaar, muzikant, of beide",
        hint: "Bepaalt de toon en terminologie van de biografie.",
        info: "Het vakgebied waarin je werkt — bepaalt het vocabulaire van de biografie (galerie-taal vs. festival-taal).",
        required: true,
      },
      {
        id: "locatie",
        label: "Standplaats",
        type: "text",
        placeholder: "bv. Rotterdam, Nederland",
        info: "Waar je woont of werkt. Veel curatoren en programmeurs noemen dit. Mag stad + land of alleen stad.",
      },
      {
        id: "geboorte",
        label: "Geboortejaar / -plaats",
        type: "text",
        placeholder: "bv. 1991, Antwerpen",
        info: "Optioneel. Sommige instituten en festivals verwachten dit; voor anderen is het niet relevant.",
      },
      {
        id: "aanspreekvorm",
        label: "Aanspreekvorm",
        type: "text",
        placeholder: "bv. zij/haar, hij/hem, hen/hun",
        info: "De voornaamwoorden die in de biografie gebruikt moeten worden.",
      },
    ],
  },
  {
    id: "werk",
    key: "B",
    title: "Werk",
    description: "Wat maak je en hoe ziet het eruit?",
    fields: [
      {
        id: "medium",
        label: "Medium, technieken of instrumenten",
        type: "textarea",
        placeholder:
          "bv. olieverf en collage / elektronische productie, analoge synths, zang",
        info: "Materiaal of techniek waarmee je werkt. Voor muziek: instrumenten, software, zang.",
        required: true,
      },
      {
        id: "stijl",
        label: "Stijl en esthetiek",
        type: "textarea",
        placeholder: "Hoe zou je je signatuur of klank omschrijven?",
        info: "De visuele of auditieve handtekening van je werk — hoe iemand het zou herkennen of beschrijven.",
      },
      {
        id: "themas",
        label: "Thema's en onderwerpen",
        type: "textarea",
        placeholder: "Welke ideeën, vragen of motieven keren terug in je werk?",
        info: "Onderwerpen waar je werk inhoudelijk over gaat — bv. identiteit, herinnering, klimaat, ritme, taal.",
      },
      {
        id: "kernwerk",
        label: "Kenmerkend werk of project",
        type: "textarea",
        placeholder:
          "Beschrijf één werk, album of serie die je praktijk goed vat.",
        info: "Eén specifiek werk of project dat een goede ingang biedt om je praktijk te begrijpen.",
      },
    ],
  },
  {
    id: "achtergrond",
    key: "C",
    title: "Achtergrond",
    description: "Waar komt je praktijk vandaan?",
    fields: [
      {
        id: "opleiding",
        label: "Opleiding",
        type: "textarea",
        placeholder: "Academies, conservatoria, diploma's, jaartallen.",
        info: "Formele opleidingen met naam, plaats en jaartallen. Autodidact mag ook expliciet genoemd worden.",
      },
      {
        id: "invloeden",
        label: "Invloeden en mentoren",
        type: "textarea",
        placeholder: "Kunstenaars, docenten, scenes of tradities die je vormden.",
        info: "Mensen, scenes of tradities die je vorming hebben gestuurd. Mag breed: artiesten, denkers, plekken.",
      },
      {
        id: "oorsprong",
        label: "Hoe het begon",
        type: "textarea",
        placeholder: "Het keerpunt of de aanleiding om hieraan te beginnen.",
        info: "Het moment, de aanleiding of het keerpunt waardoor je naar deze praktijk bent gekomen.",
      },
    ],
  },
  {
    id: "carriere",
    key: "D",
    title: "Carrière",
    description: "Wat heb je tot nu toe gedaan en bereikt?",
    fields: [
      {
        id: "exposities",
        label: "Exposities of optredens",
        type: "textarea",
        placeholder:
          "Belangrijkste shows, festivals of concerten — met locatie en jaartal.",
        info: "Belangrijkste publieke momenten van je werk. Verzin niets — gebruik alleen wat klopt, met locatie en jaartal indien bekend.",
      },
      {
        id: "prijzen",
        label: "Prijzen, beurzen en residenties",
        type: "textarea",
        placeholder: "Onderscheidingen, subsidies, residentieprogramma's.",
        info: "Formele erkenningen: prijzen, beurzen, subsidies, residentieprogramma's.",
      },
      {
        id: "pers",
        label: "Publicaties en pers",
        type: "textarea",
        placeholder: "Recensies, interviews, catalogi, releases.",
        info: "Waar over je werk geschreven is — recensies, interviews, catalogi, platenrecensies.",
      },
      {
        id: "netwerk",
        label: "Collecties, galeries of labels",
        type: "textarea",
        placeholder: "Vertegenwoordiging, collecties, platenlabels, samenwerkingen.",
        info: "Galeries die je vertegenwoordigen, labels waarop je uitbrengt, collectieven waar je deel van bent.",
      },
    ],
  },
  {
    id: "heden",
    key: "E",
    title: "Heden",
    description: "Waar sta je nu en waar ga je naartoe?",
    fields: [
      {
        id: "huidig",
        label: "Huidige projecten",
        type: "textarea",
        placeholder: "Waar werk je op dit moment aan?",
        info: "Waar je nu mee bezig bent — kan een serie, een opdracht, een tour, of onderzoek zijn.",
      },
      {
        id: "komend",
        label: "Recente of komende events",
        type: "textarea",
        placeholder: "Aankomende releases, exposities of optredens.",
        info: "Aankomende of recente publieke momenten — releases, exposities, optredens.",
      },
      {
        id: "ambitie",
        label: "Richting en ambities",
        type: "textarea",
        placeholder: "Waar beweegt je werk naartoe?",
        info: "Waar je werk naartoe wil. Welke vragen wil je verkennen of welk werk wil je in de komende jaren maken?",
      },
      {
        id: "links",
        label: "Website en socials",
        type: "text",
        placeholder: "bv. amirabloom.com, @amirabloom",
        info: "Officiële kanalen waar je werk te vinden is — website, Instagram, Bandcamp, etc.",
      },
    ],
  },
];

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "nl", label: "Nederlands" },
  { value: "en", label: "Engels" },
  { value: "de", label: "Duits" },
  { value: "fr", label: "Frans" },
];

export const LENGTH_OPTIONS: { value: Length; label: string }[] = [
  { value: "kort", label: "Kort" },
  { value: "middel", label: "Middel" },
  { value: "lang", label: "Lang" },
];

export const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: "formeel", label: "Formeel" },
  { value: "kritisch", label: "Kritisch" },
  { value: "warm", label: "Warm" },
  { value: "speels", label: "Speels" },
];

export const PERSPECTIVE_OPTIONS: { value: Perspective; label: string }[] = [
  { value: "derde", label: "Derde persoon" },
  { value: "eerste", label: "Eerste persoon" },
];

/** Alle veld-ids met hun label, voor het opbouwen van het promptbericht. */
export const FIELD_LABELS: Record<string, { section: string; label: string }> =
  Object.fromEntries(
    SECTIONS.flatMap((s) =>
      s.fields.map((f) => [
        f.id,
        { section: `${s.key} · ${s.title}`, label: f.label },
      ]),
    ),
  );
