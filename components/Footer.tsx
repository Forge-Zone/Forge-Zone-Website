"use client";
import React, { useEffect, useState } from "react";
import logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { getAllBuilds } from "@/lib/build/builds.server";
import { SingleProject } from "@/types/project.types";

const Footer: React.FC = () => {
  const [builds, setBuilds] = useState<SingleProject[]>([]);

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const buildsData = await getAllBuilds();
        if (buildsData) {
          // Get up to 4 featured or recent builds
          const featuredBuilds = buildsData
            .filter((build) => build.isFeatured)
            .slice(0, 4);

          // If we don't have 4 featured builds, add non-featured ones until we reach 4
          const displayBuilds =
            featuredBuilds.length === 4
              ? featuredBuilds
              : [
                  ...featuredBuilds,
                  ...buildsData
                    .filter((build) => !build.isFeatured)
                    .slice(0, 4 - featuredBuilds.length),
                ];

          setBuilds(displayBuilds);
        }
      } catch (error) {
        console.error("Error fetching builds for footer:", error);
      }
    };

    fetchBuilds();
  }, []);

  return (
    <footer className="w-full bg-black text-white p-6 z-[999]">
      <div className="container mx-auto h-[30vh] flex flex-col md:flex-row justify-between items-start md:items-start">
        <div className="flex items-start space-x-3">
          <Image src={logo} alt="Logo" width={150} height={75} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4 md:mt-0">
          <div>
            <h4 className="text-lg font-semibold">Builds</h4>
            <ul className="text-white/60 space-y-2">
              {builds.length > 0 ? (
                builds.map((build) => (
                  <li key={build.id}>
                    <Link
                      href={`/p/${build.projectSlug}`}
                      className="hover:text-gray-300"
                    >
                      {build.name}
                    </Link>
                  </li>
                ))
              ) : (
                // Fallback content while builds are loading
                <>
                  <li>
                    <Link href="./builds" className="hover:text-gray-300">
                      View All Builds
                    </Link>
                  </li>
                  <li>
                    <Link href="./builds" className="hover:text-gray-300">
                      Featured Projects
                    </Link>
                  </li>
                  <li>
                    <Link href="./builds" className="hover:text-gray-300">
                      Latest Builds
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold">About</h4>
            <ul className="text-white/60 space-y-2">
              {[
                { href: "./vision", label: "Vision" },
                // { href: "./notes", label: "Notes" },
                {
                  href: "https://discord.gg/e3RfmAVAXV",
                  label: "Discord",
                  external: true,
                },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    className="hover:text-gray-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-white/60  text-sm">
        <p>© {new Date().getFullYear()} Forge Zone.</p>
        <div className="flex space-x-4">
          {[
            { href: "./privacy", label: "Privacy Policy" },
            { href: "./tos", label: "Terms of Service" },
          ].map((link, index) => (
            <Link key={index} href={link.href} className="hover:text-gray-300">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Contact Bar */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="text-center">
          <p className="text-lg manrope font-normal text-white/90">
            Questions? Ideas? Just want to chat?{" "}
            <a
              href="mailto:shrit@forgezone.dev"
              className="text-white hover:text-gray-300 transition-colors duration-300 font-semibold"
            >
              Email us at shrit@forgezone.dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
