import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FeatureCards } from "@/components/home/feature-cards";
import { HeroSection } from "@/components/home/hero-section";
import { Navbar } from "@/components/home/navbar";
import { StatsCard } from "@/components/home/stats-card";

export const metadata: Metadata = {
  title: "AI Document Intelligence",
  description:
    "Turn invoices, forms, IDs, and contracts into structured, review-ready data with AWS Textract Studio.",
};

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-grid" aria-hidden="true" />
      <div className="home-ambient home-ambient-one" aria-hidden="true" />
      <div className="home-ambient home-ambient-two" aria-hidden="true" />

      <Navbar />

      <main>
        <HeroSection />

        <section className="home-showcase" id="features" aria-labelledby="features-title">
          <div className="home-section-heading">
            <span>BUILT FOR REAL DOCUMENTS</span>
            <div>
              <h2 id="features-title">Document intelligence, without the complexity.</h2>
              <p>
                Move from an unstructured file to useful, traceable data in one focused workspace.
              </p>
            </div>
          </div>
          <FeatureCards />
          <StatsCard />
        </section>

        <section className="home-final-cta" id="use-cases" aria-labelledby="home-cta-title">
          <div>
            <span className="home-kicker">INVOICES · FORMS · RECEIPTS · CONTRACTS</span>
            <h2 id="home-cta-title">Inspect the workflow with a complete example.</h2>
            <p>
              Open the local processing simulation, then review its structured output and source trace.
            </p>
          </div>
          <Link href="/upload" className="home-button home-button-primary">
            Open the studio <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>

        <div className="home-scroll-prompt" aria-hidden="true">
          <span />
          Scroll to explore
        </div>
      </main>

      <footer className="home-footer">
        <p>© 2026 AWS Textract Studio</p>
        <p>Frontend demo · Processing and extraction are simulated locally.</p>
      </footer>
    </div>
  );
}
