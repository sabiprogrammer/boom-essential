import Image from "next/image";

type LogoImageProps = {
  className?: string;
  sizes: string;
  alt?: string;
  priority?: boolean;
};

/**
 * The client's master logo, unaltered (public/assets/branding/boom-multi-global-logo.jpeg).
 * It is a JPEG on a white square, so it must sit on a white surface; never recolour or crop it.
 */
export function LogoImage({ className, sizes, alt = "Boom Multi Global logo", priority = false }: LogoImageProps) {
  return (
    <Image
      src="/assets/branding/boom-multi-global-logo.jpeg"
      alt={alt}
      width={1080}
      height={1080}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
