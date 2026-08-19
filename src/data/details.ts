import type { Lang } from "../lib/highlight";

export type Detail = {
  slug: string;
  year: string;
  role: string;
  timeline: string;
  problem: string;
  decisions: Array<{ title: string; body: string }>;
  outcome: string[];
  extra: { caption: string; meta: string; lang: Lang; code: string };
};

export const DETAILS: Record<string, Detail> = {
  reputrack: {
    slug: "reputrack",
    year: "2025",
    role: "Solo — schema, API, UI, billing, deploy",
    timeline: "6 weeks to first paying firm",
    problem:
      "Professional services firms get referrals from reviews, but asking a client twice is worse than never asking. Existing tools blast requests on a schedule and have no idea whether a review already landed. Firms churned off them because of the embarrassment, not the price.",
    decisions: [
      {
        title: "Uniqueness in the database, not the application",
        body: "A composite unique index on (firm_id, client_id) with onConflictDoNothing. Two concurrent requests cannot both win, no matter what the app layer does. The application never has to remember the rule because the schema cannot forget it.",
      },
      {
        title: "Platform polling decoupled from request sending",
        body: "A separate worker reconciles review state from each platform. Request sending reads that state rather than trusting its own history, so a review left directly still suppresses the follow-up.",
      },
      {
        title: "Escalation before publication",
        body: "Anything under four stars routes to the firm privately first. That single rule is the entire product thesis and it lives in one function with one test.",
      },
    ],
    outcome: [
      "Zero duplicate requests since launch — enforced structurally",
      "Firms see negative feedback before the public does",
      "Stripe subscription billing with local entitlement state",
    ],
    extra: {
      caption: "reconcile.ts",
      meta: "worker",
      lang: "ts",
      code: `// platform state is the source of truth, not our send log
for (const firm of await activeFirms()) {
  const external = await platforms.fetchReviews(firm);

  await db.transaction(async (tx) => {
    await tx
      .insert(reviews)
      .values(external.map(toRow(firm.id)))
      .onConflictDoUpdate({
        target: [reviews.platform, reviews.externalId],
        set: { rating: sql\`excluded.rating\`, seenAt: new Date() },
      });

    await tx
      .update(reviewRequests)
      .set({ state: "satisfied" })
      .where(inArray(reviewRequests.clientId, external.map((r) => r.clientId)));
  });
}`,
    },
  },

  lineup: {
    slug: "lineup",
    year: "2025",
    role: "Solo — product, design, build, deploy",
    timeline: "Shipped in 3 weeks, iterating since",
    problem:
      "Event organisers in Addis were running waitlists in spreadsheets and Telegram threads. Nobody knew their position, organisers could not tell real interest from noise, and every list had to be rebuilt for the next event.",
    decisions: [
      {
        title: "Position computed inside the transaction",
        body: "Insert and count happen in one transaction, so the number a person is shown is the number they hold. Computing it afterwards would let two simultaneous signups both read the same position.",
      },
      {
        title: "Bilingual without an i18n library",
        body: "A locale store, a t() function, and a cookie. Around 60 lines. An i18n package would have added a build step and a bundle for something with two locales and no plural edge cases worth the weight.",
      },
      {
        title: "Free tier that is genuinely free",
        body: "No card to start. In this market a signup wall before value is the end of the funnel, not the top of it.",
      },
    ],
    outcome: [
      "Live at lineup.dawit.dev",
      "Full EN / አማርኛ across every attendee surface",
      "Ethiopian calendar rendering where the context calls for it",
    ],
    extra: {
      caption: "locale.ts",
      meta: "i18n",
      lang: "ts",
      code: `// the entire i18n layer — no dependency, no build step
const DICT = { en, am } as const;
type Locale = keyof typeof DICT;

export const locale = writable<Locale>(readCookie("locale") ?? "en");

export function t(key: keyof typeof en, vars?: Record<string, string>) {
  const table = DICT[get(locale)];
  const raw = table[key] ?? en[key];
  if (!vars) return raw;
  return raw.replace(/\\{(\\w+)\\}/g, (_, k) => vars[k] ?? "");
}`,
    },
  },

  vigil: {
    slug: "vigil",
    year: "2025",
    role: "Solo — full stack",
    timeline: "Built over 4 weekends",
    problem:
      "Paid uptime monitoring prices per-check, which punishes you for monitoring thoroughly. I wanted enough checks to be useful and a status page I would actually link a client to, without a per-monitor bill.",
    decisions: [
      {
        title: "Hand-rolled sessions",
        body: "Auth is on the critical path for the dashboard but not for the public status page. A vendor outage should never take down a status page whose whole job is being up when things are down.",
      },
      {
        title: "Turso at the edge",
        body: "Checks are small, frequent, and read-heavy near the viewer. libSQL replicas put status page reads close to whoever is panicking.",
      },
      {
        title: "Incidents open themselves",
        body: "Consecutive failures past a threshold open an incident and update the public page. No human step between detection and disclosure.",
      },
    ],
    outcome: [
      "Public status pages update without manual intervention",
      "No third-party dependency in the auth path",
      "Runs comfortably inside free infrastructure tiers",
    ],
    extra: {
      caption: "incident.ts",
      meta: "TS",
      lang: "ts",
      code: `const FAILURE_THRESHOLD = 3;

export async function recordResult(monitorId: string, result: CheckResult) {
  const recent = await lastResults(monitorId, FAILURE_THRESHOLD);
  const failing = recent.every((r) => !r.ok) && !result.ok;

  if (failing && !(await openIncident(monitorId))) {
    await db.insert(incidents).values({ monitorId, startedAt: new Date() });
    await publishStatusPage(monitorId);
  }

  if (result.ok) await resolveOpenIncident(monitorId);
}`,
    },
  },

  "ph-performance": {
    slug: "ph-performance",
    year: "2024 — present",
    role: "Engineer on a live product with real users",
    timeline: "Ongoing",
    problem:
      "A youth football platform with roughly ten thousand users across coaches, athletes and parents, in a monorepo of about 420k lines running on a single Heroku dyno. Every change has to assume the system stays up while it lands.",
    decisions: [
      {
        title: "Additive migrations only",
        body: "New tables and columns, never a destructive change in the same deploy as the code that needs it. Expand, migrate, contract — with the contract step landing days later once nothing reads the old shape.",
      },
      {
        title: "CREATE INDEX CONCURRENTLY, always",
        body: "A plain CREATE INDEX takes a lock that blocks writes. On a table this size that is an outage. Concurrently is slower and cannot run in a transaction — that tradeoff is not negotiable here.",
      },
      {
        title: "Read the query plan before shipping the query",
        body: "One dyno means no headroom to absorb a sequential scan. EXPLAIN ANALYZE is part of writing the query, not part of debugging it later.",
      },
    ],
    outcome: [
      "No migration-caused downtime",
      "N+1 queries caught in review rather than in production",
      "The largest codebase I ship in weekly",
    ],
    extra: {
      caption: "explain output",
      meta: "psql",
      lang: "bash",
      code: `# before: sequential scan on 2.1M rows
Seq Scan on session_attendance  (cost=0.00..48213.00 rows=1 width=48)
  Filter: ((session_id = 88421) AND (status = 'present'))
  Rows Removed by Filter: 2098443
Execution Time: 812.443 ms

# after: partial index on the hot predicate
Index Scan using attendance_present_idx  (cost=0.43..8.45 rows=1 width=48)
Execution Time: 0.119 ms`,
    },
  },

  gebeta: {
    slug: "gebeta",
    year: "2026",
    role: "Solo — backend architecture and three portals",
    timeline: "Phase 0 backend complete and tested",
    problem:
      "Restaurant platforms built elsewhere assume card payment, permanent addresses, and reliable connectivity. In Addis, cash on delivery is normal, addresses are described rather than numbered, and connectivity drops mid-order.",
    decisions: [
      {
        title: "Cash as a first-class payment method",
        body: "Not a fallback branch bolted onto a card flow. The order state machine treats cash and card as peers, so neither path is the degraded one.",
      },
      {
        title: "One typed API, three portals",
        body: "Django Ninja generates the schema; diner, restaurant and admin front ends consume the same contract. Three portals sharing one source of type truth means a backend change breaks the build, not production.",
      },
      {
        title: "Descriptive delivery locations",
        body: "Landmarks and phone-first contact rather than assuming a street address resolves. Modelled that way in the schema from day one.",
      },
    ],
    outcome: [
      "Backend complete and under test",
      "Three portal surfaces sharing one typed contract",
      "Order model that fits how the market actually operates",
    ],
    extra: {
      caption: "order state",
      meta: "Python",
      lang: "ts",
      code: `class OrderState(models.TextChoices):
    PLACED     = "placed"
    CONFIRMED  = "confirmed"
    PREPARING  = "preparing"
    DISPATCHED = "dispatched"
    DELIVERED  = "delivered"
    CANCELLED  = "cancelled"

TRANSITIONS = {
    OrderState.PLACED:     {OrderState.CONFIRMED, OrderState.CANCELLED},
    OrderState.CONFIRMED:  {OrderState.PREPARING, OrderState.CANCELLED},
    OrderState.PREPARING:  {OrderState.DISPATCHED},
    OrderState.DISPATCHED: {OrderState.DELIVERED},
}

def transition(order, to):
    if to not in TRANSITIONS.get(order.state, set()):
        raise InvalidTransition(f"{order.state} -> {to}")
    order.state = to`,
    },
  },

  meskot: {
    slug: "meskot",
    year: "2026",
    role: "Solo — full stack",
    timeline: "In build",
    problem:
      "Scheduling tools ask Ethiopian users to think in a calendar they do not use day to day. Someone booking a meeting should not have to convert dates in their head to confirm a time they already know.",
    decisions: [
      {
        title: "Ethiopian calendar in the domain, not the view",
        body: "Conversion lives in a pure module with property tests over a wide date range. Rendering a converted date is trivial; getting leap years and the 13th month right is not.",
      },
      {
        title: "Ge'ez numerals as a display concern",
        body: "Stored values stay numeric. Numerals are a formatting decision at the edge, so sorting, arithmetic and storage are never affected by presentation.",
      },
      {
        title: "Amharic across the attendee flow only",
        body: "Organiser dashboards stay English. Splitting the translation surface keeps the workload honest and matches how these products are actually used.",
      },
    ],
    outcome: [
      "Date conversion covered by property tests",
      "Full attendee flow in EN and አማርኛ",
      "Booking without mental date arithmetic",
    ],
    extra: {
      caption: "ethiopic.test.ts",
      meta: "Vitest",
      lang: "ts",
      code: `test("round-trips every day across 40 years", () => {
  const start = new Date(Date.UTC(2000, 0, 1));

  for (let i = 0; i < 40 * 365; i++) {
    const day = new Date(start.getTime() + i * 86_400_000);
    const back = toGregorian(toEthiopian(day));
    expect(back.toISOString().slice(0, 10)).toBe(day.toISOString().slice(0, 10));
  }
});

test("handles pagume, the 13th month", () => {
  const pagume = toEthiopian(new Date(Date.UTC(2024, 8, 8)));
  expect(pagume.month).toBe(13);
});`,
    },
  },
};
