export default function Loading() {
  return (
    <section className="home-section">
      <h1 className="pokemon-header-title block py-2.5 text-center font-pocket-monk text-[wheat] text-[60px]">
        Pokedex
      </h1>
      <div className="home-loading relative top-[5vw]">
        <img
          src="/images/loading-img/loading250x250-2.gif"
          alt="loading-img"
          className="block mx-auto"
        />
      </div>
    </section>
  );
}
