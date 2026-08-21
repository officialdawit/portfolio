import { FileCheck2, HelpCircle, KeyRound, Ruler, Users } from "lucide-react";
import { AccordionApp } from "./ui/card-split-accordion";
import { SectionHead } from "./SectionHead";

/**
 * The questions people have before they get in touch but rarely ask.
 * Scan the titles, open the one that applies — what an accordion is for.
 */
const ITEMS = [
  {
    id: 1,
    title: "What kind of work I take on",
    icon: <Users size={18} strokeWidth={1.6} />,
    content:
      "Three shapes. Building a product from nothing, joining something half-finished and getting it live, or a defined piece of work with a clear edge to it. If yours doesn't fit any of those, say so anyway — I will tell you straight if it is not for me.",
  },
  {
    id: 2,
    title: "What you own at the end",
    icon: <KeyRound size={18} strokeWidth={1.6} />,
    content:
      "All of it. The code sits in a repository in your name. Hosting, the database and every service account are yours, in your accounts, paid by you. Nothing is rented from me and nothing needs my permission later. If we stop working together you lose nothing but me.",
  },
  {
    id: 3,
    title: "How long things take",
    icon: <Ruler size={18} strokeWidth={1.6} />,
    content:
      "Depends entirely on what it is, so I will not guess before understanding it. What I will do is give you a written plan with the work broken into pieces and a date against each one, before you commit to anything.",
  },
  {
    id: 4,
    title: "Working with one person",
    icon: <FileCheck2 size={18} strokeWidth={1.6} />,
    content:
      "You get the person who designed the database and the person who chose the button colour, because they are the same person. Nothing gets lost in a handover. The trade is that I am one person, so I take on a small number of things at a time and say no to the rest.",
  },
];

export function Working() {
  return (
    <section aria-labelledby="working" className="border-b border-line-soft">
      <div className="rail py-14 sm:py-20">
        <SectionHead id="working" title="Before you get in touch" Icon={HelpCircle} />
        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-muted">
          The things people usually want to know and do not always ask.
        </p>
        <div className="mt-10">
          <AccordionApp items={ITEMS} />
        </div>
      </div>
    </section>
  );
}
