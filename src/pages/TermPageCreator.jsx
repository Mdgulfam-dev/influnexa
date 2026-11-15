
import React from "react";

export default function TermPageCreator() {
  return (
    <div
      className="min-h-screen px-4 pb-12 pt-10 text-[#17161C] sm:px-6 lg:px-8"
      style={{
        backgroundColor: "#FAF9F6",
        backgroundImage: `
          linear-gradient(to bottom, rgba(0,0,0,0.10), transparent 35px),
          linear-gradient(to right, rgba(231,227,218,0.38) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(231,227,218,0.38) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 128px 72px, 128px 72px",
        backgroundPosition: "top left",
      }}
    >
      <div className="mx-auto max-w-[1180px]">
        <button
          type="button"
          onClick={() => window.close()}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-black transition hover:text-[#C7842A]"
        >
          ← Return to Registration
        </button>

        <header className="mb-8 border-b border-[#E7E3DA] pb-7">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Creator Terms & Conditions
          </h1>
          <p className="mt-3 max-w-[650px] text-[14px] leading-6 text-[#8A8578]">
            Please read the following terms and conditions carefully before completing your InfluNexa creator registration.
          </p>
        </header>

      
<section className=" mx-auto w-full max-w-[950px] overflow-hidden rounded-2xl border border-[#E7E3DA] bg-white shadow-[0_10px_35px_rgba(23,22,28,0.07)]">

  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7E3DA] bg-gradient-to-r from-[#FFFCF6] to-[#FDF6E9] px-5 py-6 sm:px-8">
    <div>
      <h2 className="text-xl font-bold tracking-tight text-[#17161C]">
        Creator Agreement
      </h2>
      <p className="mt-1.5 text-sm text-[#8A8578]">
        Official Terms & Conditions
      </p>
    </div>
  </div>

  <div className="bg-[#F8F7F3] p-3 sm:p-5">
    <div className="overflow-hidden rounded-xl border border-[#E7E3DA] bg-white shadow-sm">
      <iframe
        src="https://docs.google.com/document/d/1tFeL8l5vljb0dyNJVN5ck06F0xXvatFN3UnIx_EOCxk/preview"
        title="Creator Terms and Conditions"
        className="h-[75vh] min-h-[550px] w-full rounded-lg bg-white sm:h-[80vh]"
        loading="lazy"
      />
    </div>
  </div>
</section>


        <footer className="mt-6 border-t border-[#E7E3DA] pt-5 text-center">
          <p className="text-xs text-[#8A8578]">
            © {new Date().getFullYear()} Influnexa. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
