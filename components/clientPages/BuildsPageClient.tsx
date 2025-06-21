"use client";
import React, { useEffect } from "react";
import { getLoggedInUser, getUserCompletetion } from "@/lib/auth/auth";
import { getBuilds } from "@/lib/build/build";
import { SingleProject } from "@/types/project.types";
import { UserType } from "@/types/user.types";
import { BuildsPageSkeleton } from "@/components/skeletons/buildHomeSkeleton";
import BuildsCard from "../Builds/BuildsCard";
import { AlertCircle } from "lucide-react";

const BuildsPageClient = () => {
  const [user, setUser] = React.useState<UserType | undefined | null>();
  const [builds, setBuilds] = React.useState<SingleProject[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [profileCompletion, setProfileCompletion] = React.useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getBuilds(setBuilds), getLoggedInUser(setUser)]);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      getUserCompletetion(user, setProfileCompletion);
    }
  }, [user]);

  const getBuildDetails = (projectName: string): SingleProject | undefined => {
    return builds.find((build) => build.name === projectName);
  };

  const userProjectNames = user?.projects.map((p) => p.projectname) || [];
  const filteredBuilds = builds.filter(
    (build) => !userProjectNames.includes(build.name)
  );

  if (loading) {
    return <BuildsPageSkeleton />;
  }

  return (
    <div className="mt-[6rem] mx-auto max-w-7xl px-4 mb-10 ">
      {profileCompletion != 0 && profileCompletion < 75 && (
        <div className="mb-8 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <div>
            <h3 className="font-semibold text-yellow-500">
              Complete your profile
            </h3>
            <p className="text-sm text-yellow-500/80">
              Your profile is only {profileCompletion}% complete. Complete your
              profile to get the most out of ForgeZone!
            </p>
          </div>
        </div>
      )}
      {user?.projects && user.projects.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold manrope">My Builds</h2>
          <div className="flex flex-wrap mt-6">
            {user.projects.map((userProject, index) => {
              const buildDetails = getBuildDetails(userProject.projectname);
              if (!buildDetails) return null;

              return (
                <BuildsCard
                  key={index}
                  title={buildDetails.name}
                  description={buildDetails.oneLiner}
                  imageUrl={buildDetails.activeImg}
                  link={buildDetails.projectSlug}
                  mode={"user"}
                  userCurrent={userProject.current}
                  buildType={buildDetails.projectType}
                  buildStepsLength={buildDetails.stepsLength}
                />
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-bold manrope">Builds 🔥</h2>
        {filteredBuilds.length > 0 ? (
          <div className="flex flex-wrap mt-6">
            {filteredBuilds.map((build, index) => (
              <BuildsCard
                key={index}
                title={build.name}
                description={build.oneLiner}
                imageUrl={build.activeImg}
                link={build.projectSlug}
                buildType={build.projectType}
                mode="unknown"
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 text-center py-10">
            <p className="text-xl text-gray-500 manrope font-bold">
              No new builds available right now. Check back later!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default BuildsPageClient;
