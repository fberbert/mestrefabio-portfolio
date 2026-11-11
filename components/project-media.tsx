import Image, { StaticImageData } from "next/image";
import clsx from "clsx";

type ProjectMediaProps = {
  title: string;
  imageUrl?: StaticImageData;
  video?: string;
  sizes: string;
  className?: string;
};

// Screenshot or video of a project, framed the same way on every screen size.
export default function ProjectMedia({ title, imageUrl, video, sizes, className }: ProjectMediaProps) {
  if (!imageUrl && !video) return null;

  return (
    <div
      className={clsx(
        "relative aspect-[16/10] overflow-hidden rounded-sm border border-line bg-surface",
        className,
      )}
    >
      {video ? (
        <video
          className="h-full w-full bg-[oklch(0.16_0.012_55)] object-contain"
          controls
          playsInline
          preload="none"
          poster={imageUrl?.src}
          aria-label={title}
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes={sizes}
            quality={85}
            className="object-cover object-top"
          />
        )
      )}
    </div>
  );
}
