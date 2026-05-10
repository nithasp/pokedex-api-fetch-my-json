"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section-error text-center">
      <div className="wrap-container">
        <div className="container-error absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="container-error-item1 flex justify-center items-center h-[270px] max-[576px]:h-[45vw]">
            <span className="number text-[16rem] font-bold text-[antiquewhite] max-[576px]:text-[35vw]">
              !
            </span>
            <span className="mx-[5px]">
              <img
                src="/images/pokeball-png-45330.png"
                className="pokeball w-[15rem] h-[15rem] max-[576px]:w-[30vw] max-[576px]:h-[30vw]"
                alt="pokeball"
              />
            </span>
            <span className="number text-[16rem] font-bold text-[antiquewhite] max-[576px]:text-[35vw]">
              !
            </span>
          </div>
          <div className="container-error-item2">
            <h3 className="thicker text-[2.75rem] tracking-[2px] max-[576px]:text-[8vw]">
              Something went wrong
            </h3>
            <p className="text-[1.5rem] tracking-[0.5px] max-[576px]:text-[5vw]">
              {error.message || "Please try again."}
            </p>
          </div>
          <div className="container-error-item3 mt-[30px] max-[576px]:mt-[7vw]">
            <button
              type="button"
              onClick={reset}
              className="bg-transparent border-2 border-[#436a96] rounded-[50px] py-2.5 px-[30px] text-white cursor-pointer mr-2.5 transition-all duration-300 hover:bg-black max-[576px]:py-[2vw] max-[576px]:px-[5vw]"
            >
              <span className="text-[1.3rem] tracking-[1px] max-[576px]:text-[5vw]">
                Try again
              </span>
            </button>
            <Link
              href={ROUTES.home}
              className="no-underline text-white border-2 border-[#436a96] rounded-[50px] py-2.5 px-[30px] transition-all duration-300 hover:bg-black max-[576px]:py-[2vw] max-[576px]:px-[5vw]"
            >
              <span className="text-[1.3rem] tracking-[1px] max-[576px]:text-[5vw]">
                Go Back Home
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
