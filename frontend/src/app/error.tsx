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
    <section className="section-error">
      <div className="wrap-container">
        <div className="container-error">
          <div className="container-error-item1">
            <span className="number">!</span>
            <span>
              <img
                src="/images/pokeball-png-45330.png"
                className="pokeball"
                alt="pokeball"
              />
            </span>
            <span className="number">!</span>
          </div>
          <div className="container-error-item2">
            <h3 className="thicker">Something went wrong</h3>
            <p>{error.message || "Please try again."}</p>
          </div>
          <div className="container-error-item3">
            <button
              type="button"
              onClick={reset}
              style={{
                background: "transparent",
                border: "2px solid #436a96",
                borderRadius: "50px",
                padding: "10px 30px",
                color: "#fff",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              <span>Try again</span>
            </button>
            <Link href={ROUTES.home}>
              <span>Go Back Home</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
