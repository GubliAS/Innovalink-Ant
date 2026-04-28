// REPLACE: paste the inner content of your SVG here.
// Keep the <svg> wrapper below — just swap out the child elements.
// Set fill/stroke colors to "currentColor" so hover states work automatically.
import type { SVGProps } from "react";

export default function SoftwareIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 35 29"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M7.07166 19.6685L1.41406 14.0109L7.07166 8.35334M27.7565 19.6685L33.4141 14.0109L27.7565 8.35334M20.6141 1.21094L14.2141 26.8109" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
    </svg>
  );
}
