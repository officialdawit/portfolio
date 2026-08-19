import { Approach } from "../components/Approach";
import { Contact } from "../components/Contact";
import { Hero } from "../components/Hero";
import { BuildChart } from "../components/BuildChart";
import { Capabilities } from "../components/Capabilities";
import { Integrations } from "../components/Integrations";
import { Stats } from "../components/Stats";
import { Tooling } from "../components/Tooling";
import { StackTicker } from "../components/StackTicker";
import { Work } from "../components/Work";

export function Home() {
  return (
    <>
      <main>
        <Hero />
        <StackTicker />
        <Stats />
        <Work />
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
