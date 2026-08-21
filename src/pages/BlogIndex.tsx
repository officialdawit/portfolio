import { PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHead } from "../components/PageHead";
import { Reveal } from "../components/Reveal";
import { POSTS } from "../data/posts";
import { useMeta } from "../lib/useMeta";

export function BlogIndex() {
  useMeta({
    title: "Writing",
    description:
      "Short technical write-ups on problems hit in production and what the fix actually was.",
    path: "/blog",
  });

  return (
    <>
      <PageHead
        index="B"
        eyebrow="Writing"
        title="Notes from things that broke."
        standfirst="Short technical write-ups on problems I hit in production and what the fix actually was."
        Icon={PenLine}
      />
      <section className="border-b border-line-soft">
        <div className="rail">
          {POSTS.map((post, i) => (
            <Reveal key={post.slug} delay={i * 60}>
              <Link
                to={`/blog/${post.slug}`}
                className="group block border-b border-line-soft px-4 py-8 transition-colors duration-150 hover:bg-raised sm:px-6"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="label label-fg">{post.index}</span>
                  <span aria-hidden className="label text-dim">/</span>
                  <time className="label" dateTime={post.date}>{post.date}</time>
                  <span aria-hidden className="label text-dim">·</span>
                  <span className="label">{post.reading}</span>
                  <span className="ml-auto flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <span key={t} className="label border border-line-soft px-2 py-0.5">{t}</span>
                    ))}
                  </span>
                </div>
                <h2 className="mt-5 max-w-2xl text-[22px] font-medium leading-snug tracking-[-0.015em] sm:text-[26px]">
                  {post.title}
                </h2>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">{post.standfirst}</p>
                <span className="label label-fg mt-5 inline-flex items-center gap-1.5">
                  Read
                  <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
