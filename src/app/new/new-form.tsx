"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { InfoTooltip } from "@/components/info-tooltip";
import { OutputSettingsControls } from "@/components/output-settings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import type { Locale, Strings } from "@/lib/i18n";
import { SECTIONS, t } from "@/lib/questionnaire";
import { loadDraft, saveDraft } from "@/lib/storage";
import { DEFAULT_SETTINGS, type Answers, type OutputSettings } from "@/lib/types";

const TOTAL_STEPS = SECTIONS.length + 1;
const SETTINGS_STEP = SECTIONS.length;

type NewStrings = Strings["newPage"];
type CommonStrings = Strings["common"];

interface SettingsLabels {
  language: string;
  length: string;
  tone: string;
  perspective: string;
}

export function NewForm({
  locale,
  strings,
  common,
  settingsLabels,
}: {
  locale: Locale;
  strings: NewStrings;
  common: CommonStrings;
  settingsLabels: SettingsLabels;
}) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [settings, setSettings] = useState<OutputSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setAnswers(draft.answers);
      setSettings(draft.settings);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveDraft({ answers, settings });
  }, [answers, settings, hydrated]);

  const section = step < SETTINGS_STEP ? SECTIONS[step] : null;
  const progress = useMemo(
    () => Math.round(((step + 1) / TOTAL_STEPS) * 100),
    [step],
  );

  function setField(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function missingRequired(): string | null {
    if (!section) return null;
    const empty = section.fields.find(
      (f) => f.required && !answers[f.id]?.trim(),
    );
    return empty ? t(empty.label, locale) : null;
  }

  function next() {
    const missing = missingRequired();
    if (missing) {
      toast.error(
        locale === "en"
          ? `Please fill in "${missing}" to continue.`
          : `Vul "${missing}" in om verder te gaan.`,
      );
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function generate() {
    if (!answers.naam?.trim()) {
      toast.error(
        locale === "en"
          ? "A name or artist name is required to make a bio."
          : "Een naam of artiestennaam is nodig om een bio te maken.",
      );
      setStep(0);
      return;
    }
    saveDraft({ answers, settings });
    router.push("/result");
  }

  const stepLabel = strings.stepLabel
    .replace("{n}", String(step + 1))
    .replace("{total}", String(TOTAL_STEPS));

  return (
    <main className="container max-w-2xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft />
            {common.home}
          </Link>
        </Button>
        <span className="text-sm text-muted-foreground">{stepLabel}</span>
      </div>

      <Progress value={progress} className="mb-8" />

      {section ? (
        <Card>
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {strings.sectionLabel} {section.key}
            </p>
            <CardTitle className="display-serif text-2xl">
              {t(section.title, locale)}
            </CardTitle>
            <CardDescription>
              {t(section.description, locale)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {section.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {t(field.label, locale)}
                  {field.required && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                  {field.info && (
                    <InfoTooltip
                      text={t(field.info, locale)}
                      label={strings.infoLabel}
                    />
                  )}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.id}
                    placeholder={t(field.placeholder, locale)}
                    value={answers[field.id] ?? ""}
                    onChange={(e) => setField(field.id, e.target.value)}
                  />
                ) : (
                  <Input
                    id={field.id}
                    placeholder={t(field.placeholder, locale)}
                    value={answers[field.id] ?? ""}
                    onChange={(e) => setField(field.id, e.target.value)}
                  />
                )}
                {field.hint && (
                  <p className="text-xs text-muted-foreground">
                    {t(field.hint, locale)}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {strings.sectionLabel} F
            </p>
            <CardTitle className="display-serif text-2xl">
              {strings.outputTitle}
            </CardTitle>
            <CardDescription>{strings.outputDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <OutputSettingsControls
              settings={settings}
              onChange={setSettings}
              locale={locale}
              labels={settingsLabels}
            />
          </CardContent>
        </Card>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={back}
          disabled={step === 0}
          className={step === 0 ? "invisible" : ""}
        >
          <ArrowLeft />
          {common.back}
        </Button>

        {step < SETTINGS_STEP ? (
          <Button onClick={next}>
            {common.next}
            <ArrowRight />
          </Button>
        ) : (
          <Button onClick={generate}>
            <Sparkles />
            {strings.generateBio}
          </Button>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {strings.requiredHint}
      </p>
    </main>
  );
}
