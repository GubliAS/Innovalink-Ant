import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function iconButton({ image, href, alt, className }) {
  return (
    <Link href={href}>
      <div className="w-7  h-7 items-center flex justify-center cursor-pointer  rounded-full border border-neutral-7 bg-neutral-7">
        <Image
          className={`${className}  `}
          src={image}
          alt={alt}
          width="1920"
          height="1080"
        />
      </div>
    </Link>
  );
}
