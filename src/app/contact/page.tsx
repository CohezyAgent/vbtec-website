import { contactPage as c } from "@/content/company-pages";
import { getFaqs } from "@/content/faqs";
import PageHero from "@/components/sections/PageHero";
import Faq from "@/components/sections/Faq";
import LeadSection from "@/components/lead/LeadSection";
import JsonLd from "@/components/ui/JsonLd";
import { routes } from "@/lib/routes";
import { contactPage, localBusiness } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import ContactAside from "./_components/ContactAside";
import ContactDetails from "./_components/ContactDetails";
import styles from "./_components/Contact.module.css";
import LatestPosts from "@/components/sections/LatestPosts";

// /contact (05 §7.4): Hero type with the form (W) → details band (D) → mini FAQ (W).
// No LeadSection at the end (the form IS the hero) and no sticky mobile CTA (handled by SiteChrome).
export const metadata = buildMetadata({ title: c.title, description: c.description, path: routes.contact() });

export default function ContactPage() {
  return (
    <>
      <PageHero
        variant="type"
        path={routes.contact()}
        breadcrumb={[{ label: "Home", href: routes.home() }, { label: "Contact" }]}
        eyebrow="Contact"
        title={c.h1}
        lead={<p>{c.lead}</p>}
        trustLine
      >
        <div className={styles.layout}>
          <div className={styles.form}>
            <LeadSection bron={routes.contact()} variant="contact" heading={c.formHeading} />
          </div>
          <ContactAside />
        </div>
      </PageHero>

      <ContactDetails />

      <LatestPosts />

      <Faq title={c.faqTitle} items={[...getFaqs(["reactietijd", "gegevens"]), ...c.faqExtra]} />

      <JsonLd data={[localBusiness(), contactPage(routes.contact(), c.title)]} />
    </>
  );
}
