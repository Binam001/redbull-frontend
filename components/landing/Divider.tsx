"use client";

const Divider = () => {
  return (
    <section className="w-full h-svh relative overflow-hidden flex items-center justify-center p-0 m-0">
      <div className="absolute top-20 z-30 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.08] text-secondary">
          Built for the <span className="text-primary">Ride</span>
          <br />
          Born to Push <span className="text-primary">Limits.</span>
        </h2>
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-white via-25% via-transparent to-transparent z-20" />
      {/* Foreground Cans Image Standing in Front of the Heading */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        <video
          ref={(video) => {
            if (video) {
              video.playbackRate = 0.8;
            }
          }}
          src="/videos/ramp-jump-1.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>
    </section>
  );
};

export default Divider;
