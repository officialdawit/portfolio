export type Project = {
  slug: string;
  index: string;
  kind: string;
  name: string;
  headline: string;
  summary: string;
  stack: string[];
  url?: string;
  /** real screenshot; omitted projects fall back to a designed panel */
  image?: string;
  repo?: string;
  status: "live" | "in build" | "private";
  /** rendered inside the framed module — the technical proof for this project */
  sample: { caption: string; meta: string; lang: "ts" | "bash" | "sql"; code: string };
};

export const PROJECTS: Project[] = [
  {
    index: "03.1",
    kind: "Reputation SaaS",
    slug: "reputrack",
    name: "RepuTrack",
    headline: "Review management for firms that can't ask twice",
    summary:
      "CPAs and attorneys live or die on referrals. RepuTrack automates the review request loop, watches every platform for new ratings, and escalates anything under four stars before it becomes public.",
    stack: ["SvelteKit 5", "Postgres", "Drizzle", "Stripe", "Resend"],
    status: "live",
  sample: {
    caption: "review-request.ts",
    meta: "TS",
    lang: "ts",
    code: `// one request per client, ever — enforced in the DB, not the app
const [request] = await db
  .insert(reviewRequests)
  .values({ firmId, clientId, channel: "email" })
  .onConflictDoNothing({ target: [reviewRequests.firmId, reviewRequests.clientId] })
  .returning();

if (!request) return { ok: false, reason: "already_requested" } as const;

await resend.emails.send({
  from: firm.sender,
  to: client.email,
  subject: \`How did we do, \${client.firstName}?\`,
  react: ReviewRequestEmail({ firm, token: request.token }),
});`,
  },
  },
  {
    index: "03.2",
    kind: "Event infrastructure",
    slug: "lineup",
    name: "Lineup",
    headline: "Waitlists for events that actually sell out",
    summary:
      "Organizers open a waitlist in under a minute, share one link, and watch signups convert. Fully bilingual — English and አማርኛ — with the Ethiopian calendar where it belongs.",
    stack: ["SvelteKit 5", "Neon Postgres", "Drizzle", "Tailwind v4"],
    url: "https://lineup.dawit.dev",
    image: "/shots/lineup.webp",
    status: "live",
  sample: {
    caption: "waitlist/+page.server.ts",
    meta: "SvelteKit",
    lang: "ts",
    code: `export const actions = {
  join: async ({ request, locals, getClientAddress }) => {
    const data = joinSchema.safeParse(await request.formData());
    if (!data.success) return fail(400, { errors: data.error.flatten() });

    const allowed = await rateLimit(getClientAddress(), "waitlist:join");
    if (!allowed) return fail(429, { message: m.too_many_attempts() });

    const position = await db.transaction(async (tx) => {
      const [row] = await tx.insert(signups).values(data.data).returning();
      return tx.$count(signups, eq(signups.eventId, row.eventId));
    });

    return { position };
  },
} satisfies Actions;`,
  },
  },
  {
    index: "03.3",
    kind: "Developer tooling",
    slug: "vigil",
    name: "Vigil",
    headline: "Uptime monitoring with a status page worth linking",
    summary:
      "Checks run on a schedule, incidents open themselves, and the public status page updates without anyone touching it. Auth is hand-rolled — no third-party session dependency in the critical path.",
    stack: ["SvelteKit 5", "Turso", "libSQL", "Hand-rolled auth"],
    status: "live",
  sample: {
    caption: "monitor run",
    meta: "bash",
    lang: "bash",
    code: `$ pnpm vigil check --all
[ok]    api.reputrack.com        204ms   200
[ok]    lineup.dawit.dev         118ms   200
[warn]  status.vigil.sh          812ms   200   slow: >500ms
[fail]  legacy.internal          --      522   incident #481 opened

4 monitors · 1 incident · status page updated 0.3s ago`,
  },
  },
  {
    index: "03.4",
    kind: "Wholesale commerce",
    slug: "suq",
    name: "Suq",
    headline: "The B2B storefront your buyers actually want",
    summary:
      "Wholesale runs on negotiated prices, payment terms and bulk orders \u2014 none of which normal shop checkout handles. Suq gives every buyer their own agreed pricing and a portal that matches how their purchasing already works.",
    stack: ["SvelteKit 5", "Postgres", "Drizzle", "Stripe"],
    url: "https://suq.dawit.dev",
    image: "/shots/suq.webp",
    status: "live",
    sample: {
      caption: "buyer-pricing.ts",
      meta: "TS",
      lang: "ts",
      code: `// each buyer sees their agreed price, never the list price
const [tier] = await db
  .select()
  .from(priceTiers)
  .where(and(eq(priceTiers.buyerId, buyer.id), eq(priceTiers.productId, product.id)))
  .limit(1);

return tier?.unitPrice ?? product.listPrice;`,
    },
  },
  {
    index: "03.5",
    kind: "Marketplace",
    slug: "gebeta",
    name: "Gebeta",
    headline: "Restaurant operations built for Addis, not ported to it",
    summary:
      "Three portals — diner, restaurant, admin — over one typed Python API. Menus, orders, and delivery modelled around how Ethiopian restaurants actually run, including cash on delivery as a first-class path.",
    stack: ["Django Ninja", "Next.js 16", "Postgres", "TypeScript"],
    status: "in build",
  sample: {
    caption: "api/orders.py",
    meta: "Django Ninja",
    lang: "ts",
    code: `@router.post("/orders", response={201: OrderOut, 409: ErrorOut})
def create_order(request, payload: OrderIn):
    restaurant = get_object_or_404(Restaurant, id=payload.restaurant_id)

    if not restaurant.is_open_now():
        return 409, {"detail": "restaurant_closed"}

    with transaction.atomic():
        order = Order.objects.create(
            restaurant=restaurant,
            customer=request.auth,
            payment_method=payload.payment_method,  # cash is first-class here
        )
        OrderItem.objects.bulk_create(order.build_items(payload.items))

    return 201, order`,
  },
  },
  {
    index: "03.6",
    kind: "Scheduling",
    slug: "meskot",
    name: "Meskot",
    headline: "Booking links that speak Amharic and know የኢትዮጵያ ቀን አቆጣጠር",
    summary:
      "Scheduling for the Ethiopian market — Ge'ez numerals, the Ethiopian calendar, and Amharic throughout the attendee flow, without asking anyone to think in a foreign date system to book a meeting.",
    stack: ["Next.js 16", "Neon Postgres", "Drizzle", "Tailwind v4"],
    status: "in build",
  sample: {
    caption: "ethiopic-date.ts",
    meta: "TS",
    lang: "ts",
    code: `const GEEZ = ["", "\u1369", "\u136A", "\u136B", "\u136C", "\u136D", "\u136E", "\u136F", "\u1370", "\u1371"];

export function toEthiopian(date: Date): EthiopianDate {
  const jdn = gregorianToJdn(date);
  const days = jdn - ETHIOPIC_EPOCH;
  const year = Math.floor((4 * days + 1463) / 1461);
  const dayOfYear = days - (365 * year + Math.floor(year / 4));

  return {
    year,
    month: Math.floor(dayOfYear / 30) + 1,
    day: (dayOfYear % 30) + 1,
  };
}

export const toGeez = (n: number): string =>
  String(n).split("").map((d) => GEEZ[Number(d)]).join("");`,
  },
  },
];

export const STACK = [
  "SvelteKit 5",
  "Next.js 16",
  "TypeScript",
  "Tailwind v4",
  "Drizzle ORM",
  "Postgres",
  "Neon",
  "Turso",
  "Stripe",
  "Better Auth",
  "Resend",
  "Vercel",
  "Django Ninja",
  "Biome",
  "Zod",
  "Playwright",
];
