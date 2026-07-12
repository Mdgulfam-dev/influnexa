import Button from "./Button";

export default function Hero() {
  return (
    <section className="hero-shell production-hero relative flex min-h-screen items-center overflow-hidden px-4 py-32">
      <div className="hero-copy mx-auto max-w-5xl text-center">
        <div className="hero-kicker mx-auto">Influencer marketing agency</div>
        <h1>
          Premium creator campaigns built for brand trust.
        </h1>
        <p className="mx-auto">
          Influnexa helps brands plan, source, manage, and report influencer marketing, UGC, product review, and creator campaigns with production grade care.
        </p>
        <div className="hero-actions justify-center">
          <Button href="/register/brand">Start a Campaign</Button>
          <Button href="/register/influencer" variant="secondary">Join as Creator</Button>
        </div>
      </div>
    </section>
  );
}
