export default function InfluencerCard({ name, followers, engagement }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:-translate-y-1 hover:shadow-glow transition-all">
      <img src="https://via.placeholder.com/150" className="rounded-xl mb-3" />

      <h3 className="font-semibold">{name}</h3>

      <p className="text-sm text-gray-400">🔥 {followers} followers</p>

      <p className="text-sm text-gray-400">💬 {engagement}% engagement</p>

      <span className="text-xs mt-2 inline-block bg-white/10 px-3 py-1 rounded-full">
        Fashion
      </span>
    </div>
  );
}
