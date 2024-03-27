import { Hero } from "../islands/Hero.tsx";
import { About } from "../components/About.tsx";
import { Services } from "../components/Services.tsx";
import { How } from "../components/How.tsx";
import { Cta } from "../islands/Cta.tsx";

export default function Home() {
  return (
    <div className="px-4 gradientStyle">
      <Hero />
      <Services />
      <About />
      <How />
      <Cta />
    </div>
  );
}
