/**
 * SVG filter that merges nearby shapes into one liquid mass: blur the alpha,
 * then push contrast hard so the soft edges snap back into a single silhouette.
 * Declared once; elements opt in with `filter: url(#gooey)`.
 */
export function GooeyDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute" focusable="false">
      <defs>
        <filter id="gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}
