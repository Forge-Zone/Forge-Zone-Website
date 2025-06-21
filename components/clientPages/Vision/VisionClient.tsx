"use client";
import ForgeBlogs from "@/components/vision/ForgeBlogs";
import React from "react";

const VisionClient = () => {
  return (
    <div className="relative">
      <section
        className="h-[60vh] w-full sm:fixed top-0 left-0 bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center [filter:sepia(0.2)] relative bg-black/80"
        style={{
          backgroundImage: `url('https://i.postimg.cc/gkzCKP4k/image.png')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        <h1 className="text-3xl sm:text-5xl manrope font-[800] text-white text-center z-10 relative w-[50%]">
          Vision
        </h1>
        <div className="flex items-center gap-2 text-white/60 z-10 relative">
          <img
            src="/pfp/pfp-1.png"
            alt="Shrit"
            width={40}
            height={40}
            className="rounded-full mt-2"
          />
          <b>Shrit</b> • 10 min read
        </div>
      </section>
      <section className="relative z-10 mt-0 sm:mt-[60vh] backdrop-blur-3xl bg-black/40 px-12 py-40 text-lg flex items-start justify-center min-h-screen">
        <div className="max-w-[40rem] w-full flex flex-col gap-10 py-5">
          <ForgeBlogs />
        </div>
      </section>
    </div>
  );
};

export default VisionClient;
