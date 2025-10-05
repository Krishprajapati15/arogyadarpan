import { getCurrentUser } from "@/actions/onboarding";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Onboarding - MediMeet",
  description: "Complete your profile to get started with MediMeet",
};

export default async function OnboardingLayout({ children }) {
  // Get complete user profile
  const user = await getCurrentUser();

  // Redirect users who have already completed onboarding
  if (user) {
    if (user.role === "PATIENT") {
      redirect("/doctors");
    } else if (user.role === "DOCTOR") {
      // Check verification status for doctors
      if (user.verificationStatus === "VERIFIED") {
        redirect("/doctor");
      } else {
        redirect("/doctor/verification");
      }
    } else if (user.role === "ADMIN") {
      redirect("/admin");
    }
  }

  return (
    <div className="relative z-0 container mx-auto px-0 py-12 -mt-4 -mb-20">
      {/* Background Dots Layer */}
      <div
        className={cn(
          "absolute inset-0 -z-10", // Negative z-index
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
        )}
      />

      <div className="absolute inset-0 -z-10 flex items-center justify-center bg-white dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Step Into Care, Your Way
          </h1>
          <p className="text-muted-foreground text-lg">
            Whether You are healing or helping, start your journey below.
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
