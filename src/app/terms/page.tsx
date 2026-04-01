import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
      <div className="flex items-center gap-2 text-sm text-foreground/50 mb-8 font-medium">
        <Link href="/" className="hover:text-[#3DDC84] transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">Terms of Service</span>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
      <p className="text-foreground/60 mb-10">Last updated: October 25, 2024</p>

      <div className="prose prose-invert max-w-none text-foreground/80 space-y-6">
        <h2 className="text-2xl font-bold text-white mt-10 mb-4">1. Agreement to Terms</h2>
        <p>
          By viewing or accessing Bili Mod, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">2. Use License</h2>
        <p>
          Permission is granted to temporarily download the materials (information or software) on Bili Mod's website for personal, 
          non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-foreground/70">
          <li>You may not modify or copy the materials for commercial purposes.</li>
          <li>You may not attempt to decompile or reverse engineer any software contained on the website.</li>
          <li>You may not remove any copyright or other proprietary notations from the materials.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">3. Disclaimer</h2>
        <p>
          The materials on Bili Mod's website are provided on an 'as is' basis. Bili Mod makes no warranties, expressed or implied, 
          and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of 
          merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">4. Limitations</h2>
        <p>
          In no event shall Bili Mod or its suppliers be liable for any damages (including, without limitation, damages for loss of data 
          or profit, or due to business interruption) arising out of the use or inability to use the materials on Bili Mod's website.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">5. Revisions and Errata</h2>
        <p>
          The materials appearing on Bili Mod's website could include technical, typographical, or photographic errors. Bili Mod does 
          not warrant that any of the materials on its website are accurate, complete or current. We may make changes to the materials 
          contained on the website at any time without notice.
        </p>
      </div>
    </div>
  );
}
