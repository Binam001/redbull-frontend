import React from "react";

const VideoSection1 = () => {
  return (
    <div className="h-svh relative">
      <div className="absolute inset-0 w-full h-full">
        <video
          src="/videos/gold-drink-video-4.mp4"
          loop
          muted
          playsInline
          autoPlay
          className="object-cover w-full h-full pointer-events-none"
        />
      </div>
    </div>
  );
};

export default VideoSection1;
