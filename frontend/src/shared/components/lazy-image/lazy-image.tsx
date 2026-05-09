"use client";

import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { LazyImageProps } from "@/types/lazy-image.types";

/**
 * Drop-in replacement for `react-lazy-load-image-component` with the same
 * blur-while-loading behavior. Uses native `loading="lazy"` plus an opacity
 * transition that mimics the blur effect.
 */
export function LazyImage({
  src,
  placeholderSrc,
  errorSrc,
  alt = "",
  className,
  onLoad,
  onError,
  ...rest
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the image is already cached, the load event won't always fire — sync
  // the loaded flag from `complete` once the element mounts.
  useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [src]);

  useEffect(() => {
    const node = imgRef.current;
    if (node && node.complete && node.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  const handleLoad = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true);
      onLoad?.(event);
    },
    [onLoad]
  );

  const handleError = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      const target = event.currentTarget;
      if (errorSrc && target.src !== errorSrc) {
        target.src = errorSrc;
        setErrored(true);
        return;
      }
      setErrored(true);
      onError?.(event);
    },
    [errorSrc, onError]
  );

  const showPlaceholder = !loaded && !errored && Boolean(placeholderSrc);
  const placeholderClassName = `lazy-image-placeholder ${className ?? ""}`.trim();
  const imageClassName =
    `${className ?? ""} lazy-image ${loaded ? "is-loaded" : ""}`.trim();

  return (
    <span className="lazy-image-wrapper">
      {showPlaceholder && placeholderSrc && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden
          className={placeholderClassName}
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={imageClassName}
        onLoad={handleLoad}
        onError={handleError}
        {...rest}
      />
    </span>
  );
}

export default LazyImage;
