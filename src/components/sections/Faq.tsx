import type { FactKey } from "@/content/facts";
import type { FaqItem, LinkItem } from "@/content/types";
import { faqPage } from "@/lib/schema";
import { slugify } from "@/lib/format";
import Section from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import Accordion from "@/components/ui/Accordion";
import JsonLd from "@/components/ui/JsonLd";
import { SourcesList } from "@/components/ui/Facts";
import RelatedLinks from "./RelatedLinks";
import styles from "./Faq.module.css";

export type FaqProps = {
  eyebrow?: string;
  title?: string;
  /** Optional intro paragraph under the title. */
  lead?: string;
  items: FaqItem[];
  /** FAQPage JSON-LD (default: true when ≥3 items – 00 §2.8). */
  emitSchema?: boolean;
  relatedLinks?: LinkItem[];
  relatedTitle?: string;
  sources?: FactKey[];
  id?: string;
};

/** Fixed FAQ block (W). <details> rows keep answers in the DOM; JSON-LD matches `a` verbatim. */
export default function Faq({
  eyebrow = "Veelgestelde vragen",
  title = "Wat je nog wil weten",
  lead,
  items,
  emitSchema,
  relatedLinks,
  relatedTitle = "Verder lezen",
  sources,
  id = "faq",
}: FaqProps) {
  const schema = emitSchema ?? items.length >= 3;
  return (
    <Section bg="W" id={id} labelledBy={`${id}-title`}>
      <SectionIntro eyebrow={eyebrow} title={title} titleId={`${id}-title`} lead={lead} />
      <div className={styles.body}>
        <Accordion
          headingLevel="h3"
          items={items.map((f) => ({
            id: `vraag-${slugify(f.q)}`,
            title: f.q,
            body: (
              <>
                <p>{f.a}</p>
                {f.aLong && <p>{f.aLong}</p>}
              </>
            ),
          }))}
        />
        {(relatedLinks?.length || sources?.length) && (
          <div className={styles.after}>
            {relatedLinks && relatedLinks.length > 0 && <RelatedLinks title={relatedTitle} links={relatedLinks} compact />}
            {sources && sources.length > 0 && (
              <details className={styles.sources}>
                <summary className={styles.sourcesSummary}>Bronnen & aannames</summary>
                <SourcesList keys={sources} title="Bronnen & aannames" className={styles.sourcesList} />
              </details>
            )}
          </div>
        )}
      </div>
      {schema && <JsonLd data={faqPage(items)} />}
    </Section>
  );
}
