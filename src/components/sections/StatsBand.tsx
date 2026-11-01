import type { FactKey } from "@/content/facts";
import type { Cta } from "@/content/types";
import type { Stat } from "@/components/ui/charts";
import type { IntroProps } from "@/components/ui/SectionIntro";
import DataBand from "./DataBand";

/** DataBand in "stats" mode: 3–4 big numbers with FactNotes + assumptions (geometry H). */
export default function StatsBand({ intro, stats, assumptions, cta, whenTrue, id }: { intro: IntroProps; stats: Stat[]; assumptions?: FactKey[]; cta?: Cta; whenTrue?: string; id?: string }) {
  const keys = assumptions ?? stats.map((s) => s.k).filter((k): k is FactKey => typeof k === "string");
  return <DataBand id={id} intro={intro} mode="stats" stats={stats} assumptions={keys} cta={cta} whenTrue={whenTrue} />;
}
