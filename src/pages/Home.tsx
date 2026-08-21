import { Approach } from "../components/Approach";
import { Contact } from "../components/Contact";
import { Hero } from "../components/Hero";
import { BuildChart } from "../components/BuildChart";
import { Capabilities } from "../components/Capabilities";
import { Integrations } from "../components/Integrations";
import { MoreWork } from "../components/MoreWork";
import { Stats } from "../components/Stats";
import { Tooling } from "../components/Tooling";
import { StackTicker } from "../components/StackTicker";
import { Work } from "../components/Work";
import { useMeta } from "../lib/useMeta";

export function Home() {
  useMeta({
    title: "Mobile & Web Developer, System Architect",
    description:
      "Dawit Worku builds mobile apps, web platforms and the systems behind them. Based in Addis Ababa, Ethiopia. Available for work.",
    path: "/",
  });

  return (
    <>
      <main>
        <Hero />
        <StackTicker />
        <Stats />
        <Work />
        <MoreWork />
        <Capabilities />
        <Tooling />
        <Integrations />
        <BuildChart />
        <Approach />
        <Contact />
      </main>
    </>
  );
}
