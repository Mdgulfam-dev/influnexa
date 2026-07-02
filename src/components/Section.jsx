import InfluencerCard from "./InfluencerCard";

export default function Section() {
  const data = [
    { name: "Riya Sharma", followers: "120K", engagement: "5.2" },
    { name: "Aman Verma", followers: "80K", engagement: "4.8" },
    { name: "Neha Singh", followers: "200K", engagement: "6.1" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center">
        🔥 Trending Creators
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {data.map((inf, i) => (
          <InfluencerCard key={i} {...inf} />
        ))}
      </div>
    </section>
  );
}
