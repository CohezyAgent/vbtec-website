import type { ReactNode } from "react";
import { cent, eur, fx, type ServiceContent } from "@/content/services";
import Section from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import { TextLink } from "@/components/ui/CtaPill";
import { FactNote } from "@/components/ui/Facts";
import Bento from "@/components/sections/Bento";
import Timeline from "@/components/sections/Timeline";
import Rail from "@/components/sections/Rail";
import CurveExplorer from "@/components/service/CurveExplorer";
import BatterySizer from "@/components/service/BatterySizer";
import RoomCard from "@/components/service/RoomCard";
import { articleLink, comparisonLink } from "@/lib/links";
import styles from "./ServiceSignature.module.css";

/** Row 7 of the service template – the unique "signature" section per service (05 §3.1). Always W. */
export default function ServiceSignature({ s }: { s: ServiceContent }) {
  const sig = s.signature;
  const id = "signatuur";

  switch (sig.kind) {
    case "bento": {
      const link = sig.link?.article ? articleLink(sig.link.article, sig.link.label) : sig.link?.comparison ? comparisonLink(sig.link.comparison, sig.link.label) : undefined;
      return (
        <Bento
          id={id}
          bg="W"
          intro={{
            eyebrow: sig.eyebrow,
            title: sig.title,
            lead: (
              <div className={styles.lead}>
                <p>{sig.lead}</p>
                {link && <TextLink href={link.href}>{link.label}</TextLink>}
              </div>
            ),
          }}
          tiles={sig.tiles}
        />
      );
    }

    case "timeline":
      return <Timeline id={id} bg="W" intro={{ eyebrow: sig.eyebrow, title: sig.title, lead: <p>{sig.lead}</p> }} steps={sig.steps} />;

    case "rail":
      return (
        <Rail
          id={id}
          bg="W"
          kind="room"
          intro={{ eyebrow: sig.eyebrow, title: sig.title, lead: <p>{sig.lead}</p> }}
          items={sig.rooms.map((r, i) => (
            <RoomCard key={r.room} room={r} index={i} />
          ))}
        />
      );

    case "curve": {
      const link = sig.link.comparison ? comparisonLink(sig.link.comparison, sig.link.label) : sig.link.article ? articleLink(sig.link.article, sig.link.label) : undefined;
      const toggles =
        sig.curve === "day"
          ? [
              {
                key: "zonder",
                label: "Zonder sturing",
                caption: `Zonder sturing verbruikt een gezin dat overdag weg is ${fx("zelfverbruikZonder", { suffix: "%" })} van zijn zonnestroom zelf. De rest gaat voor ${cent("injectievergoeding", false)} per kWh het net op.`,
              },
              {
                key: "sturing",
                label: "+ boiler & warmtepomp",
                caption: `Laat je boiler en warmtepomp draaien als de zon schijnt, dan stijgt je zelfverbruik naar ${fx("zelfverbruikMet", { suffix: "%" })}. Elke extra zelf gebruikte kWh bespaart je ${cent("stroomprijsAllIn")}.`,
              },
              {
                key: "batterij",
                label: "+ batterij",
                caption: "Een batterij schuift je middagoverschot door naar de avond. De bovenkant van die bandbreedte vraagt doorgaans een batterij of een auto die overdag laadt – of dat bij jou loont, rekenen we apart uit.",
              },
            ]
          : [
              {
                key: "gewoon",
                label: "Gewoon laden",
                caption: `Je auto laadt bovenop je kookpiek en je maandpiek schiet omhoog. Elke kW extra maandpiek kost je ${eur("capaciteitstariefPerKw")} per jaar aan capaciteitstarief.`,
              },
              {
                key: "slim",
                label: "Slim laden",
                caption: `De laadpaal wacht tot het stil wordt in huis en laadt rustig over de nacht. Je auto is 's ochtends even vol, je maandpiek blijft laag. Onder ${fx("capaciteitstariefMinimumKw")} kW zakken levert niets meer op: dat minimum betaal je sowieso.`,
              },
            ];
      return (
        <SignatureShell
          id={id}
          eyebrow={sig.eyebrow}
          title={sig.title}
          lead={sig.lead}
          aside={
            <>
              {sig.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <FactNote keys={sig.factKeys} />
              {link && <TextLink href={link.href}>{link.label}</TextLink>}
            </>
          }
        >
          <CurveExplorer
            mode={sig.curve}
            toggles={toggles}
            summary={
              sig.curve === "day"
                ? "Grafiek van een zonnige dag: de productie van de zonnepanelen piekt rond de middag, het verbruik van het huis 's ochtends en 's avonds. Met sturing en een batterij wordt een groter deel van de zonnestroom zelf gebruikt."
                : "Grafiek van een weekavond: bij gewoon laden komt het laden van de auto bovenop de kookpiek en stijgt de maandpiek sterk. Bij slim laden schuift het laden naar de nacht en blijft de maandpiek laag."
            }
          />
        </SignatureShell>
      );
    }

    case "sizer": {
      const link = articleLink(sig.link.article, sig.link.label);
      const notes = Object.fromEntries(sig.profiles.map((p) => [p.key, p.result.factKeys ? <FactNote key={p.key} keys={p.result.factKeys} variant="footnote" /> : null]));
      return (
        <SignatureShell
          id={id}
          eyebrow={sig.eyebrow}
          title={sig.title}
          lead={sig.lead}
          aside={
            <>
              <p>{`Een thuisbatterij kost ${eur("prijsThuisbatterijPerKwh")} per kWh opslag. Elke kWh die je te veel koopt, blijft leeg staan – daarom rekenen we klein en eerlijk.`}</p>
              <FactNote keys={["prijsThuisbatterijPerKwh"]} />
            </>
          }
        >
          <BatterySizer profiles={sig.profiles} notes={notes} link={<TextLink href={link.href}>{link.label}</TextLink>} />
        </SignatureShell>
      );
    }
  }
}

function SignatureShell({ id, eyebrow, title, lead, aside, children }: { id: string; eyebrow: string; title: string; lead: string; aside: ReactNode; children: ReactNode }) {
  return (
    <Section bg="W" id={id} labelledBy={`${id}-title`}>
      <SectionIntro eyebrow={eyebrow} title={title} titleId={`${id}-title`} lead={<p>{lead}</p>} />
      <div className={styles.split}>
        <div className={styles.aside}>{aside}</div>
        <div className={styles.main}>{children}</div>
      </div>
    </Section>
  );
}
