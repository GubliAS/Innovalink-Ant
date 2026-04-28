// REPLACE: paste the inner content of your SVG here.
// Keep the <svg> wrapper below — just swap out the child elements.
// Set fill/stroke colors to "currentColor" so hover states work automatically.
import type { SVGProps } from "react";

export default function MotionIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 39 39"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
       <path d="M22.1538 21.3063L15.205 29.2471C14.9046 29.5903 14.5344 29.8653 14.1191 30.0537C13.7038 30.2421 13.253 30.3396 12.797 30.3396C12.3409 30.3396 11.8902 30.2421 11.4749 30.0537C11.0596 29.8653 10.6893 29.5903 10.389 29.2471L3.44018 21.3063C2.92977 20.723 2.64844 19.9742 2.64844 19.1991C2.64844 18.424 2.92977 17.6752 3.44018 17.0919L10.389 9.1511C10.6893 8.80792 11.0596 8.53291 11.4749 8.34449C11.8902 8.15607 12.3409 8.05859 12.797 8.05859C13.253 8.05859 13.7038 8.15607 14.1191 8.34449C14.5344 8.53291 14.9046 8.80792 15.205 9.1511L22.1538 17.0919C22.6642 17.6752 22.9455 18.424 22.9455 19.1991C22.9455 19.9742 22.6642 20.723 22.1538 21.3063Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M20.7969 30.4L28.6113 21.2832C29.1088 20.7031 29.3822 19.9642 29.3822 19.2C29.3822 18.4358 29.1088 17.6969 28.6113 17.1168L20.7969 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M27.1953 30.4L35.0097 21.2832C35.5072 20.7031 35.7807 19.9642 35.7807 19.2C35.7807 18.4358 35.5072 17.6969 35.0097 17.1168L27.1953 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
