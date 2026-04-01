import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
      <div className="flex items-center gap-2 text-sm text-foreground/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#3DDC84] transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">Privacy Policy</span>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
      <p className="text-foreground/60 mb-10">Last updated: October 25, 2024</p>

      <div className="prose prose-invert max-w-none text-foreground/80 space-y-6">
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">1. Introduction</h2>
        <p>
          Welcome to Bili Mod. We respect your privacy and are committed to protecting your personal data. 
          This privacy policy will inform you as to how we look after your personal data when you visit our website 
          and tell you about your privacy rights.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">2. The Data We Collect</h2>
        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-foreground/70">
          <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
          <li><strong>Contact Data</strong> includes email address for newsletters or review publishing.</li>
          <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
          <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">3. How We Use Your Data</h2>
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to provide 
          and improve our Services, seamlessly serve you file downloads, monitor usage metrics to optimize our servers, 
          and communicate promotions or app updates if explicitly permitted by you.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">4. Third-Party Links</h2>
        <p>
          This website may include links to third-party websites, plug-ins and applications (e.g. AdSense network placements). 
          Clicking on those links or enabling those connections may allow third parties to collect or share data about you. 
          We do not control these third-party websites and are not responsible for their privacy statements.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">5. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please contact us at via our Contact Form available on the site.
        </p>
      </div>
    </div>
  );
}
