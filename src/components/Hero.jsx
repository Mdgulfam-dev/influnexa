import Button from "./Button";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center text-center relative overflow-hidden">
      {/* Gradient Blob */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-primary to-accent blur-3xl opacity-30 rounded-full"></div>

      <div className="z-10 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Find Creators That Actually{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Convert 🚀
          </span>
        </h1>

        <p className="text-gray-400 mt-4">
          Connect with top influencers and grow your brand faster.
        </p>

        <div className="flex gap-4 justify-center mt-6">
          <Button>Get Influencers</Button>
          <Button variant="secondary">Join as Creator</Button>
        </div>
      </div>
    </section>
  );
}
