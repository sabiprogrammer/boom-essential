"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { SitePhoto } from "@/content/site-photo";
import { CloseIcon, ZoomInIcon } from "@/components/ui/icons";

/**
 * Click-to-enlarge for one of the client's own photographs. Render it INSIDE a frame that carries `data-pic`: it adds a
 * transparent button over the frame (keyboard reachable, with a corner hint) and a native <dialog> that shows the photograph
 * at no more than its own size. The large image loads only when opened. Escape, the close button and a click outside close
 * it, and focus returns to the button. Styles: app/lightbox.css and app/image-motion.css.
 *
 * Never use it for illustrative pictures (stock or generated): the shopfront scene must not be shown larger than it is.
 */
export function PhotoLightbox({ photo }: { photo: SitePhoto }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge photograph: ${photo.caption}`}
        aria-haspopup="dialog"
        className="pic-zoom-btn absolute inset-0 z-[1] cursor-zoom-in"
      />
      <span aria-hidden="true" className="pic-zoom-icon">
        <ZoomInIcon className="size-5" />
      </span>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={photo.caption}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        {open ? (
          <figure className="relative">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="94vw"
              className="block h-auto max-h-[82dvh] w-auto max-w-full object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-white">{photo.caption}</figcaption>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close enlarged photograph"
              className="absolute -top-12 right-0 inline-flex size-10 items-center justify-center border border-white/50 text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-navy"
            >
              <CloseIcon className="size-5" />
            </button>
          </figure>
        ) : null}
      </dialog>
    </>
  );
}
