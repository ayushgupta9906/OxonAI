import AnimatedBackground from "@/components/AnimatedBackground";
import HeroSection from "@/components/HeroSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import VisualShowcaseSection from "@/components/VisualShowcaseSection";
import SystemFlowSection from "@/components/SystemFlowSection";
import UseCaseSection from "@/components/UseCaseSection";
import PhilosophySection from "@/components/PhilosophySection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="relative">
            <AnimatedBackground />
            <HeroSection />
            <CapabilitiesSection />
            <VisualShowcaseSection />
            <SystemFlowSection />
            <UseCaseSection />
            <PhilosophySection />
            <FinalCTASection />
            <Footer />
        </main>
    );
}
