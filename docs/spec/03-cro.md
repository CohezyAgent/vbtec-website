# 03 – CRO: overtuigingsflow, CTA's, vertrouwen, urgentie & leadformulier

> **Status: APPROVED** – Overseer, 2026-11-01. Where this file conflicts with `00-decisions.md`, 00 wins (Overseer edits in this file are marked *[Overseer]*).

Owner: **CRO agent**. Other agents: append only under `## Notes from <agent>` at the bottom.
Depends on: `01-sitemap.md` (routes, anchor `#berekening`, hidden fields `bron` / `interesse`).

---

## 0. Grondregels (gelden voor elke pagina)

1. **De klant is het onderwerp.** Koppen gaan over *jouw* woning, *jouw* factuur, *jouw* gezin. "Wij" mag pas in bewijs/garantie-blokken. Test: als een kop ook op de site van een concurrent past, herschrijven.
2. **Aanspreekvorm:** "je/jij/jouw", Vlaams maar niet plat ("je factuur", "je woning", "een plaatsbezoek", "de premie aanvragen"). Geen "u". Geen anglicismen waar een Nederlands woord bestaat (wel: "dynamisch tarief", niet "dynamic pricing").
3. **Eerlijkheid boven alles.** Nooit "gratis energie" of "garantie op €0". Wel: "tot ~€0 energiefactuur*" met voetnoot `*indicatief, afhankelijk van verbruik, dak, isolatie en tarieven – je persoonlijke berekening is bindend`. Elk getal komt uit `src/content/facts.ts` (bron + datum) en wordt met een `<Indicatief />`-label of tooltip getoond ("Bron: VREG, okt. 2026 – indicatief").
4. **Geen dark patterns:** geen nep-countdowns, geen "nog 2 plaatsen vrij" tenzij echt beheerd in data, geen vooraf aangevinkte opt-ins, geen verborgen kosten, geen pop-up bij exit-intent.
5. **Eén primaire actie per pagina:** *Gratis berekening* → scrollt naar `#berekening` (het formulier onderaan). Secundair: telefoon, of "lees hoe het werkt" (zachte CTA voor wie nog niet klaar is).
6. **Placeholders**: reviews, projectcijfers, aantallen, garanties en certificaten staan in data-bestanden met `// PLACEHOLDER – vervang door echte gegevens`. Niet als AggregateRating/Review-schema uitsturen (zie 01 §6). In de UI geen echte merknamen/labels van derden claimen.

---

## 1. De overtuigingsflow (het skelet)

Elke template is een variatie op deze 8 beats. Volgorde mag lichtjes schuiven per template (zie §3), maar **Pijn komt altijd vóór oplossing** en **CTA altijd na bewijs**.

| # | Beat | Doel | Vorm (suggestie, wissel geometrie/achtergrond af) |
|---|---|---|---|
| 1 | **Pijn** | Herkenning: "dit is mijn factuur / mijn twijfel" | Grote kop + 1 zin, gezin/woning-beeld, evt. factuur-mockup die opsplitst |
| 2 | **Mythe** | Benoem de overtuiging die ze in hun hoofd hebben ("loont niet meer, hou je gasketel") | Citaat-stijl in grote type, doorstreept of "Klopt dat?" |
| 3 | **Bewijs met cijfers** | Ontkracht met Vlaamse feiten | CountUp-cijfers, vergelijkingsbalk gas vs WP, capaciteitstarief-piekgrafiek; altijd met bron + "indicatief" |
| 4 | **Oplossing = persoonlijke berekening** | Niet "koop product X" maar "we rekenen jouw combinatie uit" | Systeemdiagram / sticky stack van componenten, eindigend in "jouw combinatie" |
| 5 | **Risico-omkering / eerlijkheid** | Wegnemen van angst om verkocht te worden | Blok "We zeggen het ook als het niet loont" + scenario 'niets doen' + link naar case `gezin-kortrijk-geen-batterij-advies` |
| 6 | **Sociaal bewijs** | "Mensen zoals ik deden dit" | Reviews (naam + gemeente + woningtype), projectkaarten met factuur voor/na |
| 7 | **Urgentie (eerlijk)** | Waarom nu en niet over 3 jaar | Feitelijke tijdlijn (tariefwijzigingen, premie-aanpassingen, planning/wachttijd) |
| 8 | **CTA** | Formulier `#berekening` | `<LeadSection />` (multi-step), deep green achtergrond met lime accent |

### 1.1 Pijnpunten-bank (hergebruik in koppen/body)

- "Je voorschotfactuur is de laatste jaren gestegen, maar je verbruik niet."
- "Sinds het capaciteitstarief betaal je ook voor je pieken, niet alleen voor je verbruik."
- "Je zonnepanelen draaien, maar je stroom gaat voor een fractie naar het net – en 's avonds koop je duur terug."
- "Je gasketel is 15+ jaar oud. Vervangen door weer een gasketel voelt als geld weggooien, maar een warmtepomp voelt als een gok."
- "Iedereen zegt iets anders: de buurman, de verkoper, het nieuws."
- "Je kocht een woning met een slecht EPC-label en moet binnen 6 jaar renoveren." (check `fact("renovatieplichtTermijn")`, estimate → "volgens de regels van eind 2025")
- "Je wil een elektrische auto, maar vreest dat laden je capaciteitstarief opblaast."

### 1.2 Mythes-bank → tegenfeit (cijfers uit `facts.ts`)

| Mythe | Tegenfeit (formulering) | facts-key (voorstel) |
|---|---|---|
| "Zonnepanelen lonen niet meer sinds de terugdraaiende teller weg is." | "Ze lonen anders: niet door te injecteren, maar door je stroom zelf te gebruiken. Met slimme sturing haal je je zelfverbruik van ~30% naar 50–80%." | `zelfverbruikZonder`, `zelfverbruikMet`, `injectievergoeding`, `stroomprijsAllIn` |
| "Een warmtepomp is duurder in verbruik dan gas." | "Met een SCOP van ~4 maak je van 1 kWh stroom ~4 kWh warmte. Per kWh warmte betaal je dan minder dan met gas – en met eigen zonnestroom nog veel minder." | `scopRekenwaarde`, `gasprijsAllIn`, `stroomprijsAllIn`, `rendementGascondensatieketel`, `warmtekostGasPerKwhWarmte`, `warmtekostWarmtepompPerKwhWarmte` |
| "Een thuisbatterij verdien je nooit terug." | "Soms klopt dat. Daarom rekenen we het uit. Mét capaciteitstarief, dynamisch tarief en een laadpaal ligt het vaak anders." (eerlijk: geen garantie) | `capaciteitstariefPerKw`, `prijsThuisbatterijPerKwh`, `negatievePrijsUren2025` |
| "Mijn huis is te oud voor een warmtepomp." | "Veel woningen van na 1970 met dakisolatie en grotere radiatoren kunnen het al. Soms is een hybride of lucht-lucht de slimmere eerste stap." | `scopLuchtWater35`, `scopLuchtWater55`, `hybrideVerplichtIER` (vuistregel "na 1970" = copy zonder getal, geen fact) |
| "Ik wacht tot het goedkoper wordt." | *[Overseer – herschreven: batterijen wórden goedkoper, dat mogen we niet ontkennen]* "Batterijen worden inderdaad goedkoper – daarom plannen we die soms bewust later in, met een omvormer die er klaar voor is. Maar voor je verwarming en je panelen betaal je elk jaar dat je wacht je huidige factuur, en gas wordt duurder door de taxshift en de CO₂-prijs vanaf 2028." | `prijsThuisbatterijPerKwh`, `accijnsShiftGas2029`, `ets2Start`, `ets2MeerkostGasgezin` |
| "Gas blijft toch nog jaren toegelaten." | "In nieuwbouw is een gasaansluiting al niet meer toegelaten (sinds 2025); Europa en Vlaanderen sturen op uitfasering. Een nieuwe ketel van vandaag gaat 15–20 jaar mee." | `verbodGasNieuwbouw`, `levensduurGasketel` |

Builder: numbers in de kolom "Tegenfeit" hierboven zijn **richtwaarden voor copy**; de waarde die op de site staat komt altijd uit `facts.ts`. Als een fact ontbreekt of niet zeker is → zin herschrijven zonder getal.

---

## 2. Globale CTA-systeem

### 2.1 CTA-varianten (Dutch, exacte wording)

| Type | Tekst | Waar | Actie |
|---|---|---|---|
| Primair (pill + pijlcirkel) | **Gratis berekening** | Header, hero, na bewijs-blok, lead-section | `#berekening` |
| Primair contextueel | **Bereken wat jouw woning kan besparen** | Home hero, hoe-het-werkt | `#berekening` |
| Primair op dienstpagina | **Bereken of {product} loont voor jou** (bv. "Bereken of een thuisbatterij loont voor jou") | Service hero + midden | `#berekening` met `interesse` voorgeselecteerd |
| Primair op vergelijking | **Laat jouw situatie doorrekenen** | Na verdict + na tabel | `#berekening`, `interesse` = beide slugs |
| Primair op project | **Zo'n berekening voor jouw woning?** | Na resultaten | `#berekening` |
| Primair op artikel | **Wat betekent dit voor jouw factuur?** | Inline na "Kort antwoord" en eind | `#berekening` |
| Secundair (tekstlink/ghost pill) | **Bekijk hoe het werkt** / **Lees eerst hoe we werken** | Naast primaire CTA | `/hoe-het-werkt`, `/hoe-we-werken` |
| Telefoon | **Liever bellen? 0X XX XX XX XX** (PLACEHOLDER uit `company.ts`) | Header desktop, lead-section, contact | `tel:` |
| Mobiel sticky | **Gratis berekening** (compact pill) | Onderaan viewport op mobiel (<900px) | `#berekening` |

Microcopy direct onder elke primaire hero-CTA (klein, 60% opaciteit):
> **Gratis en vrijblijvend · Berekend door een ingenieur · Antwoord binnen 2 werkdagen**

(De "2 werkdagen" is een PLACEHOLDER-belofte in `company.ts` → `responseTime`; enkel tonen als de klant dat bevestigt.)

### 2.2 Plaatsingsregels

- **Header**: altijd zichtbaar (verschijnt bij scroll up). Op `/contact` scrollt de CTA naar het formulier bovenaan.
- **Hero**: 1 primaire + 1 secundaire CTA. Nooit meer dan 2 knoppen.
- **Mid-page**: maximaal 1 inline CTA per ~2 schermhoogtes, steeds *direct na een bewijs-moment* (cijferblok, project, review-wall). Nooit direct na een pijn-blok.
- **Mobiele sticky CTA-bar**: verschijnt na 1 schermhoogte scrollen, verdwijnt zodra `#berekening` in beeld komt (IntersectionObserver) en wanneer het menu open is. Hoogte ≤ 56px, safe-area padding. Geen sticky bar op `/contact`.
- **Einde pagina**: `<LeadSection />` met `id="berekening"`, gevolgd door footer.
- **Pre-select**: klik op een contextuele CTA mag `?interesse=` NIET in de URL zetten (canonicals); gebruik in plaats daarvan het `defaultInteresse`-prop van `<LeadSection />` per pagina. Op een vergelijkingspagina mogen 2 interesses voorgeselecteerd zijn.

---

## 3. Templates

Notatie: `[achtergrond / geometrie]` = voorstel om variatie te houden (wit · deep green · full image · lime-accent). Design-agent mag aanpassen, maar de **volgorde van beats** is bindend.

### 3.1 Home `/`

*[Overseer]* De **definitieve** home-volgorde staat in 05 §1 (pijn als B-stack ná de strip, mythe + cijfers ná Mission/Services). Onderstaande lijst blijft de bron voor copy-richting per beat.

Bestaande secties blijven; CRO-volgorde rond hen:

1. **Hero** (bestaand) – Pijn + belofte. Kop-richting: *"Jouw woning kan bijna al haar eigen energie maken."* Sub: *"Wij rekenen uit welke combinatie van zon, warmtepomp en batterij jouw factuur zo dicht mogelijk bij €0 brengt*. En we zeggen het eerlijk als iets niet loont."* CTA: **Bereken wat jouw woning kan besparen** + secundair **Bekijk hoe het werkt**. Microcopy-trustline (§2.1). `[full image, gezin/woning]`
2. **Mythe-blok "Loont het nog wel?"** – 3 mythes uit §1.2 die één voor één omklappen (scroll-driven): mythe in grote type → tegenfeit met cijfer + bron. Afsluiter: *"Het antwoord is: het hangt af van jouw woning. Daarom rekenen we."* `[wit, verticale sticky stack]`
3. **ProductsSection** (bestaand) – Oplossing als systeem: de 7 bouwstenen, kop *"Geen los product. Eén systeem, op maat van jouw dak, je verbruik en je gezin."* Kaarten → `/diensten/[slug]`. `[horizontaal]`
4. **Bewijs in cijfers** (MissionSection bestaand, CountUp in-view) – cijfers: aantal berekeningen gemaakt, gem. besparing per jaar, % klanten dat we iets *afraadden* (eerlijkheidscijfer!), gem. reviewscore. Alles PLACEHOLDER in `company.ts`/`facts.ts`. Inline CTA erna: **Gratis berekening**. `[deep green]`
5. **Eerlijkheid / risico-omkering** – *"We zeggen het ook als het niet loont."* 3 kolommen: "Je krijgt altijd een scenario 'niets doen'", "We verkopen geen merk, we rekenen", "Geen voorschot vóór je akkoord". Link: case Kortrijk. `[lime-accent band, kort]`
6. **ServicesSection** (bestaand) – hoe we werken in stappen → `/hoe-we-werken`.
7. **Projecten** – 3 featured projectkaarten met *factuur voor → na* als hoofdgetal, woningtype + gemeente. `[full image / horizontale scroll]`
8. **Reviews** – review-wall (6), elk met voornaam + gemeente + wat ze lieten plaatsen. `[wit]`
9. **"Twijfel je?"** – 3 vergelijkingskaarten → `/vergelijken/...`.
10. **Urgentie** – *"Waarom nu rekenen (en niet pas als je ketel stuk is)"*: tijdlijn met 3–4 feitelijke items (§5). `[deep green]`
11. **Kennisbank-teaser** (3 populaire) – voor wie nog niet klaar is.
12. **LeadSection** `#berekening`.

### 3.2 Dienst-salespagina `/diensten/[slug]`

1. **Hero (klantgericht)** – kop = de vraag/pijn van de familie, niet het product. Vb. warmtepomp: *"Je gasketel is aan vervanging toe. Wat als je volgende 'ketel' 4× zo zuinig is?"*; thuisbatterij: *"Je panelen produceren overdag. Jij verbruikt 's avonds."* CTA **Bereken of {product} loont voor jou** + trustline. `[full image]`
2. **Pijn uitgediept** – 2–3 herkenbare situaties (bullets met icoon) uit §1.1.
3. **Mythe + feit** – de product-specifieke mythe (§1.2) met 1 grafiek/vergelijking (bv. kost per kWh warmte gas vs WP vs WP+zon). Bron + indicatief.
4. **Hoe het in jouw systeem past** – mini-systeemdiagram: dit product + 2–3 complementaire diensten → `/hoe-het-werkt`. `[deep green, sticky beeld + scrollende tekst]`
5. **Wat onze ingenieur voor jou uitrekent** – checklist (bv. warmtepomp: warmteverliesberekening per kamer, radiatorcheck, SCOP bij jouw aanvoertemperatuur, geluid/plaatsing, stroomverbruik vs zonne-opbrengst, impact capaciteitstarief, premies). Dit is de kern-USP.
6. **Wat je krijgt** – specs-/inclusief-blok: installatie, keuring/AREI, indienststelling, monitoring-app, garantie (PLACEHOLDER-termijnen), premie-aanvraag.
7. **Eerlijkheidsblok – "Wanneer we het je afraden"** – 2–4 concrete situaties waarin dit product níet loont (bv. batterij: laag avondverbruik, geen dynamisch tarief, klein PV-systeem). Zeer belangrijk voor vertrouwen. `[lime accent]`
8. **Premies & financiering** – Mijn VerbouwPremie (bedrag/voorwaarden uit facts), BTW 6% bij woning >10 jaar (indien van toepassing, facts), "wij doen het papierwerk".
9. **Projecten met dit product** – 2 kaarten (voor/na factuur).
10. **Reviews** – 3 reviews gefilterd op product.
11. **Urgentie** – 1 product-specifiek feit (§5).
12. **FAQ** – 6–8 vragen (FAQPage-schema), incl. "Wat kost een {product}?" (range + "afhankelijk van…"), "Hoe lang duurt installatie?", "Wat als het niet loont?".
13. **Gerelateerd** – kennisbank/vergelijking links (01 §5.2).
14. **LeadSection** – `defaultInteresse={slug}`; kop variant: *"Bereken of {product} loont in jouw woning."*

Mid-page CTA's: na blok 3 (cijfer) en na blok 9 (projecten).

### 3.3 Vergelijkingspagina `/vergelijken/[slug]`

Lezer zit in twijfel-modus → **antwoord eerst**, overtuigen daarna.

1. **Vraag als H1** + **"Kort antwoord"** box (40–60 woorden, AEO) met eerlijk verdict incl. "het hangt af van…". CTA **Laat jouw situatie doorrekenen**.
2. **Pijn / waarom je twijfelt** – de mythe die ze hoorden (DoubtsSection mag hier hergebruikt worden).
3. **Vergelijkingstabel** – kolommen: aankoop (range), jaarlijkse kost, onderhoud, levensduur, comfort, CO₂, premies, toekomstbestendigheid. Bron + indicatief.
4. **20-jaar kostenscenario** – grafiek met 3 lijnen (optie A / optie B / combinatie). Tekst: aannames expliciet (verbruik, prijzen, prijsstijging). Toggle "jouw verbruik" (eenvoudige slider, client-side, indicatief) – optioneel.
5. **Wanneer kies je A / wanneer B** – twee kolommen met profielen ("Je hebt…").
6. **Wanneer geen van beide** (eerlijkheid) + link naar project met "nee"-advies.
7. **Sociaal bewijs** – 1 project + 2 reviews van mensen die met deze twijfel zaten.
8. **Urgentie** – relevante tarief/premie-tijdlijn.
9. **FAQ** (FAQPage-schema).
10. **Gerelateerde vergelijkingen + diensten.**
11. **LeadSection** – `defaultInteresse` = beide slugs; kop *"Twijfel je nog? Wij rekenen beide scenario's voor jouw woning uit – gratis."*

### 3.4 Hoe het werkt `/hoe-het-werkt` (pillar)

1. **Hero** – *"Waar komt de besparing eigenlijk vandaan?"* Sub: *"Zon, warmte, opslag en slim laden – samen. Zo werkt het in jouw huis."* CTA secundair: scroll naar diagram; primair **Gratis berekening**.
2. **Pijn** – de "losse producten"-val: buurman met panelen die toch hoge factuur heeft (illustratief, geen echte persoon).
3. **Interactief huisdiagram** – hotspots per component (→ dienst), dag/nacht/winter-toggle, € -stromen. Na interactie: inline CTA *"Wil je dit voor jouw dak en verbruik zien? → Gratis berekening"*.
4. **De 4 hefbomen in cijfers** – zelfverbruik, capaciteitspiek afvlakken, goedkope uren (dynamisch), gas eruit. Elk: 1 fact + bron.
5. **Mythes** – compacte 3-lijst met links naar vergelijkingen.
6. **Eerlijkheid** – *"Niet elk huis heeft alles nodig."* Voorbeeld 3 profielen (rijwoning / jaren '70 / nieuwbouw) met verschillende aanbevolen combi.
7. **Projecten** (2) + reviews (2).
8. **Urgentie** – tijdlijn.
9. **FAQ** (FAQPage).
10. **LeadSection** – kop *"Welke combinatie past bij jouw woning? We rekenen het uit."*

### 3.5 Hub-pagina's (`/diensten`, `/vergelijken`, `/projecten`, `/blog`, `/kennisbank`)

Kortere flow, focus op routeren + 1 bewijsmoment.

1. **Hero** met de hub-vraag als kop:
   - Diensten: *"Wat heb je echt nodig? Vaak minder dan je denkt."* + *"We duwen geen product. We rekenen."*
   - Vergelijken: *"Twijfel je tussen twee keuzes? Hier is het eerlijke antwoord."*
   - Projecten: *"Families zoals jij. Hun factuur vóór en na."*
   - Blog: *"Wat verandert er aan je energiefactuur – en wat moet je ermee?"*
   - Kennisbank: *"Kort en eerlijk uitgelegd: alles over je energiefactuur."*
2. **Grid / lijst** (filters client-side op projecten; categorieën op kennisbank).
3. **Bewijsband** – 3 CountUp-cijfers of 2 reviews.
4. **Eerlijkheidszin** + link naar `/hoe-we-werken` of case Kortrijk.
5. **LeadSection** – generieke kop: *"Liever meteen weten wat het voor jóuw woning betekent?"*

Projecten-hub: elke kaart toont **hoofdgetal = jaarlijkse besparing of factuur voor→na** (indicatief), niet het product.

### 3.6 Projectdetail `/projecten/[slug]`

Storytelling-template: de familie is de held.

1. **Hero** – foto woning/gezin (placeholder beeld), kop *"{Familie/koppel} in {gemeente}: van €X naar €Y per maand"* (indicatief), chips: woningtype, bouwjaar, producten.
2. **De situatie (pijn)** – verbruik vooraf, oude installatie, wat hen dwarszat (citaat).
3. **Hun twijfel (mythe)** – wat ze dachten vóór het gesprek.
4. **Wat we berekenden** – de scenario's die we voorlegden (incl. 'niets doen' en wat we afraadden), mini-diagram gekozen setup.
5. **Resultaat (bewijs)** – factuur voor/na, zelfverbruik %, terugverdientijd, premie ontvangen. Grote cijfers, CountUp, "indicatief / gemeten over X maanden".
6. **Citaat** – grote quote van klant.
7. **Galerij**.
8. **Gebruikte producten** → diensten; **gerelateerde vergelijking**.
9. **Andere projecten** (2).
10. **LeadSection** – kop *"Zo'n berekening voor jouw woning?"* `defaultInteresse` = producten van het project.

Het "nee"-project (`gezin-kortrijk-geen-batterij-advies`) krijgt een extra blok *"Waarom we geen batterij plaatsten"* en wordt vanuit eerlijkheidsblokken site-breed gelinkt.

### 3.7 Artikel (`/blog/[slug]`, `/kennisbank/[slug]`)

Lezer zoekt info, niet een verkoper → zacht en behulpzaam; CTA = "wat betekent dit voor jou".

1. **H1 vraag** + **Kort antwoord** box + auteur (ingenieur, → `/team`) + "Laatst bijgewerkt".
2. **Inline zachte CTA** na kort antwoord (klein kaartje): *"Wat betekent dit voor jouw factuur? Laat het gratis uitrekenen."*
3. **Body** – H2's als vragen; feiten met bron; 1 rekenvoorbeeld voor een herkenbaar gezin ("Gezin met 4 personen, 3.500 kWh, gasketel…") – indicatief.
4. **Mythe-callout** – waar relevant ("Veelgehoord: … Klopt niet helemaal, want …").
5. **Eerlijkheidscallout** – "Wanneer dit voor jou níet interessant is".
6. **Midden-CTA** (1×, na rekenvoorbeeld).
7. **FAQ** (kennisbank: FAQPage).
8. **Gerelateerd** – artikels, dienst, vergelijking.
9. **Auteursbox** – foto, rol, certificering (PLACEHOLDER), *"{Naam} rekent elke week installaties uit voor gezinnen zoals het jouwe."*
10. **LeadSection** – kop *"Je hebt nu de theorie. Wil je de cijfers voor jouw woning?"*

### 3.8 Over ons / Team / Hoe we werken

**Over ons** – pijn: *"Je hebt al drie verkopers over de vloer gehad. Elk met een ander verhaal."* → mythe: *"Energie-installateurs willen gewoon verkopen."* → bewijs: ons verhaal (ingenieurs, R&D op PVT), cijfers (% afgeraden, aantal berekeningen) → waarden (klant eerst, eerlijk, systeem i.p.v. product) → team-teaser → reviews → LeadSection *"Leer ons kennen via een eerlijke berekening."*

**Hoe we werken** (grootste frictie-verlager) – kop *"Wat gebeurt er als je ons contacteert? (En nee, je zit nergens aan vast.)"* → 6 stappen (StepsReveal), per stap: wat jij doet, wat wij doen, hoe lang, kost (stap 1–3: **gratis**). → *"Wat als het niet loont?"* → *"Je krijgt het zwart op wit, ook als ons advies 'niets doen' is."* → garanties & opvolging → premies-hulp → FAQ (HowTo-schema) → reviews die het proces noemen → LeadSection *"Start met stap 1: je gratis berekening."*

**Team** – kop *"Wie rekent jouw installatie uit – en wie komt er bij je thuis?"* → kaarten (foto, naam, rol, certificaten, "rekende al X installaties", 1 zin persoonlijk) – PLACEHOLDER → artikels per auteur → LeadSection *"Laat een van onze ingenieurs jouw woning doorrekenen."*

### 3.9 Contact `/contact`

Formulier is de hoofdinhoud (bovenaan, geen herhaling onderaan). Mobiele sticky bar uit.

1. **Hero + formulier naast elkaar** (desktop) / formulier eerst (mobiel). Kop *"Vraag je gratis berekening aan."* Sub *"Een ingenieur bekijkt je situatie en belt je binnen 2 werkdagen (PLACEHOLDER). Vrijblijvend – en eerlijk, ook als het niet loont."*
2. Naast formulier: **wat er daarna gebeurt** (3 mini-stappen), telefoon, e-mail, adres, werkgebied, openingsuren (PLACEHOLDER uit `company.ts`), 1 review.
3. **Mini-FAQ**: "Kost het iets?", "Zit ik ergens aan vast?", "Hoe snel kunnen jullie installeren?", "Wat doen jullie met mijn gegevens?"
4. Kaart/werkgebied (statisch, geen externe embed vereist).

---

## 4. Vertrouwenssignalen (catalogus)

Plaats in elke template minstens: 1 cijfer-bewijs, 1 review, 1 eerlijkheidsbelofte, 1 premie-signaal.

| Signaal | Formulering (NL) | Bron data | Waar |
|---|---|---|---|
| Ingenieur-berekend | "Berekend door een ingenieur, niet door een verkoper." | statisch | trustline onder elke CTA, hero, lead-section |
| Eerlijkheidsbelofte | "We zeggen het ook als het niet loont." | statisch | home, service, about, lead-section |
| % afgeraden | "In {x}% van de berekeningen raadden we minstens één product af." | `company.ts` PLACEHOLDER | home cijfers, about |
| Aantal berekeningen/projecten | "{n} woningen doorgerekend in Vlaanderen" | `company.ts` PLACEHOLDER | home, hubs |
| Reviewscore | *[Overseer]* Zolang `reviews.isPlaceholder`: **geen score en geen platformnaam** (geen "Google"), enkel label "Voorbeeldreviews". Na echte data: "{score}/5 op basis van {n} reviews" + bron | `reviews.ts` | review-wall; **geen schema**; niet in de hero-trustline |
| Reviews | Voornaam + initiaal, gemeente, woningtype, producten, datum | `reviews.ts` | service, home, projecten |
| Projecten voor/na | "€{x} → €{y} per maand" + "indicatief" | `projects.ts` | overal |
| Garanties | Fabrieksgarantie + installatiegarantie (termijnen PLACEHOLDER), "Geen voorschot vóór je akkoord" (bevestigen met klant) | `company.ts` | service "wat je krijgt", hoe-we-werken, lead-section |
| Premies-hulp | "Wij vragen je premies aan – Mijn VerbouwPremie inbegrepen." | `facts.ts` | service, hoe-we-werken, lead |
| Certificering | "Erkend installateur" + labels als tekst (PLACEHOLDER, geen logo's van derden) | `company.ts` | footer trust row, team |
| Lokaal | "Heel Vlaanderen · eigen installatieploegen" | `company.ts` | footer, contact |
| Merkonafhankelijk | "We kiezen het toestel dat bij jouw woning past, niet het merk met de hoogste marge." | statisch | diensten-hub, service |
| Opvolging | "Na installatie volgen we je opbrengst mee op." | statisch | hoe-we-werken, service |
| Transparante bronnen | Elk getal met bron + datum + "indicatief" | `facts.ts` | overal |

---

## 5. Eerlijke urgentie

Alleen feitelijk, met bron in `facts.ts`, en nooit met timers. Formuleer als **"wat het jou kost om te wachten"**, niet als druk.

| Device | Formulering | Voorwaarde |
|---|---|---|
| Kost van wachten | *"Elk jaar met je huidige installatie kost je ongeveer €{jaarlijkse meerkost} (indicatief, gezin met {profiel})."* | berekend uit facts, aannames zichtbaar |
| Stijgende nettarieven | *[Overseer: geen fact beschikbaar → v1 NIET tonen]* *"De nettarieven (o.a. capaciteitstarief) stegen in {jaar} met ~{x}%…"* | alleen als een fact `nettariefStijging` wordt toegevoegd |
| Premie-wijzigingen | *"Premiebedragen en voorwaarden worden regelmatig aangepast. Wat vandaag geldt, staat hieronder – met datum."* + "Laatst gecontroleerd: {datum}" | facts-datum |
| Gasketel-trend | *"In nieuwbouw mag geen gasaansluiting meer; bij een ketel van vandaag zit je 15–20 jaar vast aan gas."* | facts |
| Renovatieverplichting | *"Koop je een woning met EPC-label E of F? Dan moet je binnen 6 jaar renoveren."* | facts |
| Planning/wachttijd | *"Onze planning zit momenteel op ±{n} weken tussen akkoord en installatie."* | **alleen** als `company.ts.leadTimeWeeks` door de klant ingevuld is; anders blok niet tonen |
| Seizoen | *"Een warmtepomp plaats je best vóór het stookseizoen – plan je berekening in het voorjaar of de zomer."* | statisch, waar |
| Ketel-pech | *"Wacht niet tot je ketel in januari stilvalt: dan beslis je onder druk."* | statisch |

Verboden: countdowns, "actie eindigt vandaag", "nog x plaatsen", verzonnen prijsstijgingen, "laatste kans op premie" zonder officiële einddatum.

---

## 6. Leadformulier – `<LeadSection />` spec

### 6.1 Architectuur

- Component: `src/components/lead/LeadSection.tsx` (server wrapper) + `LeadForm.tsx` (`'use client'`, `useActionState`).
- Server Action: `submitLead` in `src/lib/lead.ts` (single swap point; nu enkel `console.log` van gevalideerde data + timestamp server-side).
- Props: `bron: string` (route, verplicht), `defaultInteresse?: string[]`, `heading?`, `subheading?`, `variant?: 'full' | 'contact'`.
- Section: `id="berekening"`, `aria-labelledby` naar de kop. `scroll-margin-top` = headerhoogte.
- Multi-step in de client, maar **één** `<form>` en één submit: stap 1-velden blijven in de DOM (hidden via `hidden`-attribuut/CSS) wanneer stap 2 actief is, zodat de action alle velden krijgt. Stap 1 → 2 is client-side validatie (dezelfde regels als server).
- Progressive enhancement: zonder JS tonen beide stappen onder elkaar met één submit-knop (de server valideert alles).
- Server-side validatie is de bron van waarheid; retourneer `{ status: 'error', fieldErrors, values }` of `{ status: 'success', firstName }`. Bij fout: terug naar de stap met de eerste fout, focus op eerste foutveld, waarden behouden.
- Hidden: `bron`, `interesse` wordt via checkboxes doorgegeven (voorgeselecteerd), honeypot `website` (visueel verborgen, `tabIndex={-1}`, `autoComplete="off"`; indien ingevuld → doe alsof success, log niet).
- Geen Date.now()/random in render; timestamp alleen in de action.

### 6.2 Layout & kop

Deep green achtergrond (#071813), formulier in een frosted-glass paneel, lime accenten (#dbef75), pill-knoppen. Links (desktop) de belofte, rechts het formulier.

- Eyebrow: **Gratis berekening**
- Kop (default): **"Wat kan jouw woning besparen? We rekenen het voor je uit."**
- Sub: **"Vertel ons kort hoe je woont. Een ingenieur maakt een berekening op maat – met alle scenario's, ook 'niets doen'. Gratis en vrijblijvend."**
- Belofte-lijstje (links, met vinkjes):
  - Berekend door een ingenieur, niet door een verkoper
  - Eerlijk advies – ook als het niet loont
  - Wij zoeken je premies uit
  - Je zit nergens aan vast
- Onder: *"Liever bellen? {tel}"* (PLACEHOLDER) + 1 kort review-citaat.

### 6.3 Voortgang

- *[Overseer]* Verbruik-toggle staat standaard op **"€ per maand"** (05 UI-note); kWh is de tweede optie.
- Indicator: **"Stap 1 van 2 – Jouw woning"** / **"Stap 2 van 2 – Jouw gegevens"**, met progressiebalk (50% / 100%). `aria-live="polite"` op de stap-label.
- Onder stap 1: *"Duurt minder dan een minuut."*

### 6.4 Stap 1 – Jouw situatie

Alle keuzes als grote tegel-/pill-knoppen (radio/checkbox onder de motorkap), toetsenbord-bedienbaar, min. 44px.

| Veld | name | Type | Opties / label | Verplicht |
|---|---|---|---|---|
| Woningtype | `woningtype` | radio-tegels | Open bebouwing · Halfopen · Rijwoning · Appartement · Nieuwbouw (in opbouw) · Andere | ja |
| Bouwjaar | `bouwjaar` | radio-pills | Vóór 1970 · 1970–1999 · 2000–2014 · 2015 of later · Weet ik niet | ja |
| Huidige verwarming | `verwarming` | radio-pills | Gasketel · Stookolie · Elektrisch (accumulatie/convectoren) · Warmtepomp · Pellet/hout · Andere | ja |
| Jaarverbruik of maandfactuur | `verbruikType` + `verbruikWaarde` | toggle "Ik ken mijn jaarverbruik (kWh)" / "Ik ken mijn maandelijks voorschot (€)" + numeriek veld; plus optie-link "Ik weet het niet" | ja (of "weet ik niet") |
| Interesses | `interesse` (multi) | checkbox-tegels | Zonnepanelen · PVT-panelen · Thuisbatterij · Lucht-water warmtepomp · Lucht-lucht warmtepomp (airco) · Laadpaal · Omvormer · **Ik weet het nog niet – adviseer me** | min. 1 |

Labels & hulpteksten:
- Woningtype – label **"Wat voor woning heb je?"**
- Bouwjaar – label **"Wanneer is je woning gebouwd?"**, hulp: *"Een schatting volstaat. Bij een grondige renovatie: kies het renovatiejaar."*
- Verwarming – label **"Hoe verwarm je nu?"**
- Verbruik – label **"Hoeveel verbruik je ongeveer?"**, hulp: *"Je vindt dit op je jaarafrekening of in de app van je leverancier. Geen idee? Geen probleem – kies 'Ik weet het niet', we zoeken het samen uit."*
  - kWh-veld: placeholder `bv. 3500`, suffix `kWh/jaar`, `inputMode="numeric"`
  - €-veld: placeholder `bv. 180`, suffix `€/maand`
- Interesse – label **"Waar wil je meer over weten?"**, hulp: *"Kies gerust meerdere. We rekenen ze samen door – soms raden we er ook eentje af."* De optie "Ik weet het nog niet" is exclusief (deselecteert de rest en omgekeerd).
- Knop: **"Volgende stap"** (pill + pijlcirkel).

### 6.5 Stap 2 – Jouw gegevens

| Veld | name | Type / autocomplete | Verplicht |
|---|---|---|---|
| Naam | `naam` | text, `autoComplete="name"` | ja |
| E-mail | `email` | email, `autoComplete="email"` | ja |
| Telefoon | `telefoon` | tel, `autoComplete="tel"`, `inputMode="tel"` | ja |
| Postcode | `postcode` | text, `inputMode="numeric"`, `autoComplete="postal-code"`, maxLength 4 | ja |
| Opmerking | `opmerking` | textarea, 4 rijen, max 1000 tekens + teller | nee |
| Toestemming | `toestemming` | checkbox, **niet** vooraf aangevinkt | ja |
| (Optioneel) nieuwsbrief | — | **niet in v1** (aparte toestemming nodig; weglaten) | — |

Labels & hulpteksten:
- Naam – **"Je naam"**, placeholder `Voor- en achternaam`
- E-mail – **"Je e-mailadres"**, hulp: *"Hier sturen we je berekening naartoe."*
- Telefoon – **"Je telefoonnummer"**, hulp: *"Een ingenieur belt je om een paar details te checken. Geen callcenter, geen verkooppraatjes."*
- Postcode – **"Postcode van de woning"**, hulp: *"Zo weten we welke netbeheerder en premies bij jou horen."*
- Opmerking – **"Wil je nog iets kwijt?"** (optioneel), placeholder `bv. "Mijn ketel is 18 jaar oud" of "We krijgen binnenkort een elektrische auto."`
- Toestemming – **"Ik ga ermee akkoord dat VB-TEC mijn gegevens gebruikt om mijn berekening te maken en mij hierover te contacteren. Meer info in de [privacyverklaring](/privacy)."**
- Onder de knop (klein): *"We delen je gegevens met niemand. Je krijgt geen nieuwsbrief tenzij je daar zelf om vraagt."*
- Knoppen: secundair **"Vorige"** (tekstlink met pijl links), primair **"Vraag mijn gratis berekening aan"**.
- Pending-staat (`isPending`): knop disabled, tekst **"Even geduld…"**, spinner in de pijlcirkel, `aria-busy="true"` op het formulier.

### 6.6 Validatie & foutmeldingen

Valideer op blur (na eerste interactie) en bij "Volgende"/submit. Fouten: tekst onder het veld (`aria-describedby`, `aria-invalid="true"`), rode-oranje rand + icoon (niet enkel kleur), samenvattende `role="alert"` bovenaan de stap bij submit: **"Er ontbreekt nog iets. Kijk even de gemarkeerde velden na."**

| Veld | Regel | Melding |
|---|---|---|
| woningtype | verplicht, uit lijst | "Kies wat voor woning je hebt." |
| bouwjaar | verplicht, uit lijst | "Kies ongeveer wanneer je woning gebouwd is (of 'Weet ik niet')." |
| verwarming | verplicht, uit lijst | "Vertel ons hoe je nu verwarmt." |
| verbruikWaarde (kWh) | geheel getal 500–50000, tenzij "weet ik niet" | leeg: "Vul je jaarverbruik in, of kies 'Ik weet het niet'." · buiten bereik: "Dat lijkt ons wat {weinig/veel}. Vul je jaarverbruik in kWh in (bv. 3500)." |
| verbruikWaarde (€) | getal 10–2000, tenzij "weet ik niet" | leeg: "Vul je maandelijks voorschot in, of kies 'Ik weet het niet'." · buiten bereik: "Vul je maandbedrag in euro in (bv. 180)." |
| interesse | min. 1 | "Kies minstens één onderwerp – of 'Ik weet het nog niet'." |
| naam | 2–100 tekens, trim | "Vul je naam in." |
| email | geldig formaat, max 254 | leeg: "Vul je e-mailadres in." · ongeldig: "Dit e-mailadres lijkt niet te kloppen. Kijk het even na." |
| telefoon | na strippen van spaties/punten/streepjes/`/`: `^(\+32|0032|0)[1-9]\d{7,8}$` (BE vast + gsm); tolerant: ook +31/+33/+49/+352 met 8–12 cijfers | leeg: "Vul je telefoonnummer in, dan kan een ingenieur je bellen." · ongeldig: "Dit nummer lijkt niet te kloppen. Bv. 0470 12 34 56." |
| postcode | `^[1-9]\d{3}$` | leeg: "Vul de postcode van je woning in." · ongeldig: "Een Belgische postcode heeft 4 cijfers." · buiten Vlaanderen (1300–1499, 4000–7999): **geen fout**, wel info-melding: "We werken vooral in Vlaanderen en Brussel. We bekijken je aanvraag zeker, maar bellen je eerst om te checken of we je kunnen helpen." |
| opmerking | max 1000 | "Je opmerking is te lang (max. 1000 tekens)." |
| toestemming | moet aangevinkt | "We hebben je toestemming nodig om je berekening te kunnen maken." |
| server/onbekend | — | `role="alert"`: "Er ging iets mis bij het versturen. Je gegevens zijn niet verloren – probeer het opnieuw, of bel ons op {tel}." |

### 6.7 Succes-staat

Vervangt het formulierpaneel (zelfde grootte, geen layout-sprong), focus naar de succes-kop, `role="status"`.

- Icoon: lime cirkel met vinkje (subtiele scale-in; respecteer `prefers-reduced-motion`).
- Kop: **"Bedankt, {voornaam}! Je aanvraag is goed aangekomen."**
- Tekst: **"Een van onze ingenieurs bekijkt je situatie en belt je binnen 2 werkdagen (PLACEHOLDER). Zo gaat het verder:"**
  1. **We bellen je kort** – om een paar details te checken (dak, meter, verbruik).
  2. **We rekenen je scenario's uit** – ook het scenario 'niets doen'.
  3. **Je krijgt een helder voorstel** – met cijfers, premies en terugverdientijd. Jij beslist, zonder druk.
- Tip-box: **"Tip: leg je laatste jaarafrekening alvast klaar. Heb je een digitale meter? Dan helpen je verbruiksgegevens uit Mijn Fluvius ons om nog nauwkeuriger te rekenen."**
- Links: **"Lees ondertussen hoe het werkt"** (→ `/hoe-het-werkt`) · **"Bekijk projecten van gezinnen zoals jij"** (→ `/projecten`).
- Geen tweede formulier, geen social-share.

### 6.8 Toegankelijkheid & UX-details

- Elke groep in `<fieldset>` met `<legend>` (de labelvraag).
- Tegels: echte `<input type="radio|checkbox">` visueel verborgen + `<label>`; zichtbare focus-ring (lime, 2px offset).
- Bij stapwissel: focus naar de stap-kop; scroll het formulierpaneel in beeld (niet de hele pagina naar boven).
- Stap 1-keuzes blijven bewaard als gebruiker terugklikt.
- Mobiel: één kolom, knoppen full-width, `font-size ≥ 16px` in inputs (geen iOS-zoom).
- Geen derde-partij-tracking in het formulier; analytics-events (later): `lead_step1_complete`, `lead_submit_success`, `lead_submit_error` – nu enkel als no-op functie in `lead.ts`-buurt, niet geïmplementeerd.

### 6.9 Contact-variant (`variant="contact"`)

Zelfde velden en flow; extra in stap 2: `voorkeur` radio **"Hoe mogen we je contacteren?"** – Telefoon · E-mail · Maakt niet uit (default: Maakt niet uit) en `moment` select **"Wanneer bel je best?"** – Voormiddag · Namiddag · Na 18 u · Maakt niet uit (optioneel). Kop: **"Vraag je gratis berekening aan."**

---

## 7. Copy-checklist voor builders

- [ ] Kop gaat over de klant, niet over VB-TEC.
- [ ] Elk getal → `facts.ts` met bron + datum + "indicatief".
- [ ] "€0" altijd als "tot ~€0" of "zo dicht mogelijk bij €0" + voetnoot.
- [ ] Minstens één eerlijkheidsmoment ("wanneer het niet loont") per template.
- [ ] Primaire CTA-tekst uit §2.1; elke CTA → `#berekening`.
- [ ] Trustline onder hero-CTA.
- [ ] Geen nep-urgentie (§5).
- [ ] LeadSection met juiste `bron` en `defaultInteresse`.
- [ ] Reviews/projecten/aantallen uit data-bestanden met PLACEHOLDER-comment; geen review-schema.

## Open questions (voor klant)

- Bevestigde reactietermijn ("binnen 2 werkdagen"?), actuele wachttijd installatie, garantietermijnen, "geen voorschot vóór akkoord"?
- Echt % "afgeraden" en aantal berekeningen/projecten.
- Reviewbron (Google Business Profile?) en echte reviews met toestemming.
- Werkgebied: enkel Vlaanderen of ook Brussel/Wallonië?

## Notes from other agents
