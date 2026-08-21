import { Info, PenLine } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Code } from "../components/Code";
import { PageHead } from "../components/PageHead";
import { findPost, POSTS } from "../data/posts";
import { NotFound } from "./NotFound";
import { useMeta } from "../lib/useMeta";

export function BlogPost() {
  const { slug = "" } = useParams();
  const post = findPost(slug);

  useMeta({
    title: post?.title ?? "Writing",
    description: post?.standfirst.slice(0, 180) ?? "A technical write-up.",
    path: `/blog/${slug}`,
  });

  if (!post) return <NotFound />;

  const others = POSTS.filter((p) => p.slug !== slug);

  return (
    <>
      <PageHead
        index={post.index}
        eyebrow={post.tags.join(" · ")}
        title={post.title}
        standfirst={post.standfirst}
        Icon={PenLine}
        back={{ to: "/blog", text: "All writing" }}
        meta={[
          { k: "Published", v: post.date },
          { k: "Reading time", v: post.reading },
          { k: "Topics", v: post.tags.join(", ") },
        ]}
      />

      <section className="border-b border-line-soft">
        <div className="rail px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex max-w-2xl flex-col gap-6">
            {post.blocks.map((b, i) => {
              if (b.type === "h")
                return (
                  <h2 key={i} className="mt-4 text-[21px] font-medium leading-snug tracking-[-0.015em]">
                    {b.text}
                  </h2>
                );
              if (b.type === "p")
                return (
                  <p key={i} className="text-[16px] leading-[1.75] text-muted">
                    {b.text}
                  </p>
                );
              if (b.type === "list")
                return (
                  <ul key={i} className="flex flex-col gap-2.5 border-l border-line pl-5">
                    {b.items.map((it) => (
                      <li key={it} className="text-[15px] leading-relaxed text-muted">{it}</li>
                    ))}
                  </ul>
                );
              if (b.type === "note")
                return (
                  <aside key={i} className="flex gap-3 border border-line bg-card px-4 py-4">
                    <Info size={14} strokeWidth={1.5} aria-hidden className="mt-1 shrink-0 text-fg" />
                    <p className="text-[14px] leading-relaxed text-muted">{b.text}</p>
                  </aside>
                );
              return (
                <Code key={i} caption={b.caption} meta={b.meta} lang={b.lang} code={b.code} />
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line-soft">
        <div className="rail grid grid-cols-1 sm:grid-cols-2">
          {others.map((o) => (
            <Link
              key={o.slug}
              to={`/blog/${o.slug}`}
              className="group border-b border-r border-line-soft px-4 py-7 transition-colors duration-150 hover:bg-raised sm:px-6"
            >
              <span className="label label-fg">{o.index}</span>
              <p className="mt-3 text-[17px] font-medium leading-snug tracking-[-0.01em]">{o.title}</p>
              <p className="label mt-2">{o.reading}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
