'use client'

import { useState } from "react";
import { cn } from "@/lib/utils"
import Image from 'next/image'
import { Skeleton } from "./skeleton";

export default function ImageCard({
  imageUrl,
  caption,
  className,
}) {
  const [loading, setLoading] = useState(true)
  return (
    (<figure
      className={cn(
        "overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow",
        className
      )}>
      { loading && <Skeleton className='h-full w-full absolute z-10 inset-0'/>}
      <Image priority onLoad={() => setLoading((false))} fill className="w-full" src={imageUrl} alt={caption} />
      <figcaption className="border-t-2 text-main-foreground border-border p-4">
        {caption}
      </figcaption>
    </figure>)
  );
}
