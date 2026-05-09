import type { ImgHTMLAttributes, SyntheticEvent } from "react";

export interface LazyImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "onLoad" | "onError"> {
  src: string;
  placeholderSrc?: string;
  errorSrc?: string;
  onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: SyntheticEvent<HTMLImageElement>) => void;
}
