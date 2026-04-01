import { ShieldCheck, Zap, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="space-y-8 text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">About Bili Mod</h1>
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
          Your #1 destination for safe, fast, and 100% working Android Mod APKs. We empower users to unlock the true potential of their mobile devices.
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-foreground/80 leading-relaxed mb-16">
        <h2>Our Mission</h2>
        <p>
          At Bili Mod, we believe that software should be accessible. Our mission is to provide users worldwide with an extensive library of modified applications and games that bypass restrictive paywalls and annoying advertisements.
        </p>
        
        <h2>Why Choose Us?</h2>
        <p>
          The internet is full of fake Mod APK sites loaded with malware. We stand out by rigorously testing every single application package before it hits our servers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-black/5 dark:bg-white/5 rounded-2xl text-center space-y-4 border border-black/5 dark:border-white/5">
          <div className="w-16 h-16 mx-auto bg-[#3DDC84]/20 text-[#3DDC84] flex items-center justify-center rounded-full">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">100% Virus Free</h3>
          <p className="text-sm text-foreground/60">Every file is scanned using multiple antivirus engines and verified manually by our team.</p>
        </div>
        
        <div className="p-6 bg-black/5 dark:bg-white/5 rounded-2xl text-center space-y-4 border border-black/5 dark:border-white/5">
          <div className="w-16 h-16 mx-auto bg-blue-500/20 text-blue-500 flex items-center justify-center rounded-full">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Fast Downloads</h3>
          <p className="text-sm text-foreground/60">Our files are hosted on high-performance premium CDNs for the fastest uninterrupted download speeds.</p>
        </div>
        
        <div className="p-6 bg-black/5 dark:bg-white/5 rounded-2xl text-center space-y-4 border border-black/5 dark:border-white/5">
          <div className="w-16 h-16 mx-auto bg-purple-500/20 text-purple-500 flex items-center justify-center rounded-full">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Community Driven</h3>
          <p className="text-sm text-foreground/60">We listen to our users. Most of our updates and new mods are directly requested by the community.</p>
        </div>
      </div>
    </div>
  );
}
