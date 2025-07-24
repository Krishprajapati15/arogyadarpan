import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import HealthAssistantsDashboard from "@/components/voiceassistance";

export default async function VoiceAssistantsPage() {
  const user = await checkUser();

  if (!user || user.role !== "PATIENT") {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <div className="p-4 pt-20">
        {" "}
        {/* pt-20 to account for fixed header */}
        <Link href="/">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Health Assistants Dashboard */}
      <HealthAssistantsDashboard />
    </div>
  );
}
