import { PROJECTS } from "../data/projects";
import { ProjectCard } from "./ProjectCard";
import { Boxes } from "lucide-react";
import { SectionHead } from "./SectionHead";

export function Work() {
  return (
    <section aria-labelledby="work" className="border-b border-line-soft">
      <div className="rail">
        <SectionHead id="work" title="Selected work" Icon={Boxes} />
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
