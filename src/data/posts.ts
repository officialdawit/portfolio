import type { Lang } from "../lib/highlight";

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; caption: string; meta: string; lang: Lang; code: string }
  | { type: "note"; text: string };

export type Post = {
  slug: string;
  index: string;
  title: string;
  standfirst: string;
  date: string;
  reading: string;
  tags: string[];
  blocks: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "index-concurrently",
    index: "01",
    title: "The migration that cannot take you down",
    standfirst:
      "CREATE INDEX locks writes. On a table with two million rows and ten thousand users, that is an outage with a deploy attached to it.",
    date: "2026-07-14",
    reading: "6 min",
    tags: ["Postgres", "Migrations"],
    blocks: [
      {
        type: "p",
        text: "The first time I added an index to a hot table on a live product, I did what the tutorial said. CREATE INDEX, commit, deploy. The table had around two million rows. Writes queued behind the lock, the request pool filled, and the API stopped answering for just under four minutes.",
      },
      {
        type: "p",
        text: "Nothing was broken. The migration was correct. It simply took a lock that no production table of that size can afford to give.",
      },
      { type: "h", text: "What the lock actually does" },
      {
        type: "p",
        text: "A plain CREATE INDEX takes a SHARE lock on the table. Reads continue. Writes do not — every INSERT, UPDATE and DELETE waits until the index finishes building. On a small table that is milliseconds and nobody notices. The cost scales with row count, and the day you notice is the day it is already too late.",
      },
      {
        type: "code",
        caption: "the version that hurts",
        meta: "SQL",
        lang: "sql",
        code: `-- blocks every write until it completes
create index attendance_present_idx
  on session_attendance (session_id)
  where status = 'present';`,
      },
      { type: "h", text: "The version that does not" },
      {
        type: "p",
        text: "CONCURRENTLY builds the index in two passes, letting writes through the whole time. It is slower in wall-clock terms and it cannot run inside a transaction block — which matters, because most migration tools wrap everything in one by default.",
      },
      {
        type: "code",
        caption: "the version that ships",
        meta: "SQL",
        lang: "sql",
        code: `-- no write lock; must run outside a transaction
create index concurrently if not exists attendance_present_idx
  on session_attendance (session_id)
  where status = 'present';`,
      },
      {
        type: "note",
        text: "If your migration runner wraps statements in a transaction, CONCURRENTLY will fail outright. In Drizzle, mark the migration so it runs unwrapped. Discovering this in staging is much cheaper than discovering it in production.",
      },
      { type: "h", text: "The failure mode nobody mentions" },
      {
        type: "p",
        text: "A concurrent build can fail partway and leave an INVALID index behind. It occupies space, it does not serve queries, and it will not tell you unless you look. Check for it after every concurrent migration.",
      },
      {
        type: "code",
        caption: "find dead indexes",
        meta: "psql",
        lang: "sql",
        code: `select indexrelid::regclass as index, indrelid::regclass as table
from pg_index
where indisvalid = false;`,
      },
      { type: "h", text: "The rule I follow now" },
      {
        type: "list",
        items: [
          "Every index on a table over ~100k rows goes in CONCURRENTLY.",
          "Migrations are additive. Expand, migrate, contract — with contract landing days later.",
          "No destructive change ships in the same deploy as the code that depends on it.",
          "Check for invalid indexes as the last step of the migration, not as a follow-up ticket.",
        ],
      },
      {
        type: "p",
        text: "None of this is clever. It is the difference between a migration being a routine event and being the thing your week is about.",
      },
    ],
  },
  {
    slug: "ethiopian-calendar",
    index: "02",
    title: "Why I hand-rolled the Ethiopian calendar",
    standfirst:
      "Thirteen months, a leap year that lands a year off the Gregorian one, and no library I trusted enough to put on the booking path.",
    date: "2026-06-02",
    reading: "7 min",
    tags: ["Meskot", "Dates", "Ethiopia"],
    blocks: [
      {
        type: "p",
        text: "The Ethiopian calendar has thirteen months. Twelve of thirty days, then Pagume, which has five — or six in a leap year. It runs seven to eight years behind the Gregorian calendar depending on the date, and its new year falls in September.",
      },
      {
        type: "p",
        text: "Every scheduling tool I looked at treated this as a display problem. Convert at the edge, store Gregorian, render something localised. That works until someone books across a new year boundary, and then it quietly does not.",
      },
      { type: "h", text: "Conversion belongs in the domain" },
      {
        type: "p",
        text: "I put conversion in a pure module with no dependencies and no I/O. Given a date, it returns an Ethiopian date. Given an Ethiopian date, it returns a Gregorian one. Everything else in the product treats it as settled.",
      },
      {
        type: "code",
        caption: "ethiopic.ts",
        meta: "TS",
        lang: "ts",
        code: `const ETHIOPIC_EPOCH = 1_724_220;

export function toEthiopian(date: Date): EthiopianDate {
  const days = gregorianToJdn(date) - ETHIOPIC_EPOCH;
  const year = Math.floor((4 * days + 1463) / 1461);
  const dayOfYear = days - (365 * year + Math.floor(year / 4));

  return {
    year,
    month: Math.floor(dayOfYear / 30) + 1,  // 13 when dayOfYear >= 360
    day: (dayOfYear % 30) + 1,
  };
}`,
      },
      { type: "h", text: "Test it against itself" },
      {
        type: "p",
        text: "The only test I actually trust here is a round trip across a long span. Convert every day for forty years and convert it back. If a single day disagrees, the arithmetic is wrong somewhere you would never have picked by hand.",
      },
      {
        type: "code",
        caption: "ethiopic.test.ts",
        meta: "Vitest",
        lang: "ts",
        code: `test("round-trips every day across 40 years", () => {
  const start = Date.UTC(2000, 0, 1);

  for (let i = 0; i < 40 * 365; i++) {
    const day = new Date(start + i * 86_400_000);
    expect(toGregorian(toEthiopian(day))).toEqual(day);
  }
});`,
      },
      { type: "h", text: "Numerals are a formatting concern" },
      {
        type: "p",
        text: "Ge'ez numerals are a rendering decision, nothing more. Stored values stay numeric so sorting, arithmetic and indexing are untouched. The moment numerals leak into storage you have made every query harder for a cosmetic reason.",
      },
      {
        type: "note",
        text: "Ge'ez has no zero and is not positional. Do not try to make it a general number formatter — map the digits you need for dates and stop there.",
      },
      {
        type: "p",
        text: "The whole module is under a hundred lines. Someone booking a meeting in Addis sees the date they already think in, and nobody does arithmetic in their head to confirm a time.",
      },
    ],
  },
  {
    slug: "webhooks-that-reconcile",
    index: "03",
    title: "Never let a webhook be your source of truth",
    standfirst:
      "Stripe will retry. It will also deliver out of order, twice, or four hours late. Entitlement cannot depend on any of that.",
    date: "2026-04-21",
    reading: "5 min",
    tags: ["Stripe", "Billing"],
    blocks: [
      {
        type: "p",
        text: "The naive billing integration listens for checkout.session.completed and flips a boolean. It works in testing, because in testing the webhook always arrives, once, immediately, in order.",
      },
      {
        type: "p",
        text: "In production it arrives twice. Or after the subscription has already been cancelled. Or not at all, until a retry four hours later when the user has given up and emailed you.",
      },
      { type: "h", text: "Two rules" },
      {
        type: "list",
        items: [
          "Every handler is idempotent — processing the same event twice must be indistinguishable from processing it once.",
          "Entitlement is derived from local subscription state, never from the arrival of a message.",
        ],
      },
      {
        type: "code",
        caption: "webhook.ts",
        meta: "TS",
        lang: "ts",
        code: `const [fresh] = await db
  .insert(processedEvents)
  .values({ id: event.id })
  .onConflictDoNothing()
  .returning();

if (!fresh) return new Response(null, { status: 200 }); // already handled

await db
  .insert(subscriptions)
  .values(toRow(event))
  .onConflictDoUpdate({
    target: subscriptions.stripeId,
    set: { status: sql\`excluded.status\`, periodEnd: sql\`excluded.period_end\` },
  });`,
      },
      {
        type: "p",
        text: "The processed-events table is the whole idempotency mechanism. A unique constraint on the event id, and an insert that does nothing on conflict. Duplicate deliveries fall out for free.",
      },
      { type: "h", text: "Reconcile on a schedule anyway" },
      {
        type: "p",
        text: "Webhooks get missed. A nightly job that pulls active subscriptions and reconciles them against local state costs almost nothing and removes an entire category of support ticket.",
      },
      {
        type: "note",
        text: "Always verify the signature before touching the payload, and return 200 fast. Do the work after acknowledging, or Stripe will time you out and retry something you already handled.",
      },
    ],
  },
];

export const findPost = (slug: string) => POSTS.find((p) => p.slug === slug);
