// REPLACE: paste the inner content of your SVG here.
// Keep the <svg> wrapper below — just swap out the child elements.
// Set fill/stroke colors to "currentColor" so hover states work automatically.
import type { SVGProps } from "react";

export default function ProductIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 29 29"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
     <path d="M4.73385 10.6518L14.2005 8.28516L20.1172 14.2018L17.7505 23.6685L2.36719 26.0352L4.73385 10.6518Z" stroke="currentColor" strokeWidth="1.5"/>
     <path d="M9.46719 15.3839L13.0172 18.9339M2.36719 26.0339L11.2422 17.1589M17.1589 2.36719L14.2005 8.28385L20.1172 14.2005L26.0339 11.2422L17.1589 2.36719Z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
