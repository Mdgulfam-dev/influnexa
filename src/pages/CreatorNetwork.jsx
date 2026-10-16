import CreatorDataAvailability from "./CreatorDataAvailability";

export default function CreatorNetwork() {
    
  return (
<div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

      <a href="/#industires" className="industries-back-button">
  <span className="industries-back-arrow">←</span>
  <span>Back to Website</span>
</a>
<h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">
Creators Network
</h1>

  <CreatorDataAvailability hideUserFilters={true} />
</div>
  );
}