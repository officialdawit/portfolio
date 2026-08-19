const STATS = [
  { value: "10,000", unit: "users", caption: "On the largest product I maintain" },
  { value: "420k", unit: "LOC", caption: "Monorepo I ship in weekly" },
  { value: "6", unit: "shipped", caption: "Products live in production" },
  { value: "2", unit: "languages", caption: "Every attendee surface, EN + አማ" },
];

export function Stats() {
  return (
    <section aria-label="By the numbers" className="border-b border-line-soft">
      <div className="rail grid grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.caption}
            className={`px-4 py-8 sm:px-6 ${i < 3 ? "lg:border-r" : ""} ${
              i % 2 === 0 ? "border-r lg:border-r" : ""
            } ${i < 2 ? "border-b lg:border-b-0" : ""} border-line-soft`}
          >
            <p className="flex items-baseline gap-1.5">
              <span className="text-[30px] font-medium leading-none tracking-[-0.02em] sm:text-[38px]">
                {s.value}
              </span>
              <span className="label label-fg">{s.unit}</span>
            </p>
            <p className="label mt-3 leading-[15px]">{s.caption}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
