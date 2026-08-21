/**
 * Loading indicator: a soft core with two orbiting points. Replaces a generic
 * spinner where the wait is short and the tone should stay calm.
 */
export function ThinkingOrb({ size = 18 }: { size?: number }) {
  return (
    <span
      role="status"
      aria-label="Working"
      className="orb relative inline-block shrink-0"
      style={{ width: size, height: size }}
    >
      <span aria-hidden className="orb-core" />
      <span aria-hidden className="orb-ring" />
      <span aria-hidden className="orb-ring orb-ring--slow" />
    </span>
  );
}
