import Link from "next/link";
import { ROUTES } from "@/config/routes";

export default function NotFound() {
  return (
    <section className="section-error">
      <div className="wrap-container">
        <div className="container-error">
          <div className="container-error-item1">
            <span className="number">4</span>
            <span>
              <img
                src="/images/pokeball-png-45330.png"
                className="pokeball"
                alt="pokeball"
              />
            </span>
            <span className="number">4</span>
          </div>
          <div className="container-error-item2">
            <h3 className="thicker">Uh-oh!</h3>
            <p>You look lost on your journey</p>
          </div>
          <div className="container-error-item3">
            <Link href={ROUTES.home}>
              <span>Go Back Home</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
