import CoreValueProposition from "./_component/CoreValueProposition";
import FeaturesSection from "./_component/FeaturesSection";
import Hero from "./_component/Hero";
import NewsletterSection from "./_component/Newsletter";
import UseCases from "./_component/UseCases";
import WhyNoteTree from "./_component/WhyNoteTree";

export default function Page() {
  return (
    <div>
      <Hero />
      <CoreValueProposition />
      <FeaturesSection />
      <WhyNoteTree />
      <UseCases />
      <NewsletterSection />
    </div>
  );
}
