"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Stethoscope,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setUserRole } from "@/actions/onboarding";
import { doctorFormSchema } from "@/lib/schema";
import { SPECIALTIES } from "@/lib/specialities";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";

export default function OnboardingPage() {
  const [step, setStep] = useState("choose-role");
  const router = useRouter();

  // Custom hook for user role server action
  const { loading, data, fn: submitUserRole } = useFetch(setUserRole);

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      specialty: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    },
  });

  // Watch specialty value for controlled select component
  const specialtyValue = watch("specialty");

  // Handle patient role selection
  const handlePatientSelection = async () => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "PATIENT");

    await submitUserRole(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      router.push(data.redirect);
    }
  }, [data]);

  // Added missing onDoctorSubmit function
  const onDoctorSubmit = async (data) => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "DOCTOR");
    formData.append("specialty", data.specialty);
    formData.append("experience", data.experience.toString());
    formData.append("credentialUrl", data.credentialUrl);
    formData.append("description", data.description);

    await submitUserRole(formData);
  };

  // Role selection screen
  if (step === "choose-role") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-26">
        <Card
          className="border-cyan-500/20 border-2 hover:border-cyan-500/60 cursor-pointer transition-all"
          onClick={() => !loading && handlePatientSelection()}
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 rounded-full mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Join as a Patient
            </CardTitle>
            <CardDescription className="mb-4">
              Book appointments, consult with doctors, and manage your
              healthcare journey
            </CardDescription>
            <Button
              className="w-full mt-2 cursor-pointer bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 text-white hover:bg-teal-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue as Patient"
              )}
              <ArrowRight className="ml-2 h-4 w-4 " />
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border-cyan-500/20 border-2 hover:border-cyan-500/60 cursor-pointer transition-all"
          onClick={() => !loading && setStep("doctor-form")}
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 rounded-full mb-4">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Join as a Doctor
            </CardTitle>
            <CardDescription className="mb-4">
              Create your professional profile, set your availability, and
              provide consultations
            </CardDescription>
            <Button
              className="w-full cursor-pointer mt-2 bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 text-white hover:bg-teal-700"
              disabled={loading}
            >
              Continue as Doctor <ArrowRight className="ml-2 h-4 w-4 " />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Doctor registration form
  if (step === "doctor-form") {
    return (
      <Card className="bg-white/5 border border-teal-300/20 backdrop-blur-xl shadow-2xl rounded-3xl p-6  md:p-8 mb-10">
        <CardContent>
          <div className="mb-8">
            <CardTitle className="text-3xl font-bold text-white mb-2 tracking-tight">
              👨‍⚕️ Complete Your Doctor Profile
            </CardTitle>
            <CardDescription className="text-emerald-200 text-sm">
              Please provide your professional details for verification.
            </CardDescription>
          </div>

          <form onSubmit={handleSubmit(onDoctorSubmit)} className="space-y-6">
            {/* Specialty Field */}
            <div className="space-y-2">
              <Label htmlFor="specialty" className="text-white text-sm">
                Medical Specialty
              </Label>
              <Select
                value={specialtyValue}
                onValueChange={(value) => setValue("specialty", value)}
              >
                <SelectTrigger
                  id="specialty"
                  className="bg-white/10 border border-emerald-400/30 text-white focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                >
                  <SelectValue placeholder="Select your specialty" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto bg-black/90 border border-emerald-400/10 text-white">
                  {SPECIALTIES.map((spec) => (
                    <SelectItem
                      key={spec.name}
                      value={spec.name}
                      className="flex items-center gap-2 hover:bg-emerald-500/10 transition-colors"
                    >
                      <span className="text-emerald-400">{spec.icon}</span>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialty && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.specialty.message}
                </p>
              )}
            </div>

            {/* Experience Field */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-white text-sm">
                Years of Experience
              </Label>
              <Input
                id="experience"
                type="number"
                placeholder="e.g. 5"
                className="bg-white/10 text-white border border-emerald-400/20 placeholder:text-gray-400"
                {...register("experience", { valueAsNumber: true })}
              />
              {errors.experience && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Credential URL */}
            <div className="space-y-2">
              <Label htmlFor="credentialUrl" className="text-white text-sm">
                Credential Document Link
              </Label>
              <Input
                id="credentialUrl"
                type="url"
                placeholder="https://example.com/my-medical-degree.pdf"
                className="bg-white/10 text-white border border-emerald-400/20 placeholder:text-gray-400"
                {...register("credentialUrl")}
              />
              {errors.credentialUrl && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.credentialUrl.message}
                </p>
              )}
              <p className="text-sm text-emerald-300 italic">
                Provide link to your certification or medical degree
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white text-sm">
                Service Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your expertise, services, and patient care approach..."
                rows={4}
                className="bg-white/10 text-white border border-emerald-400/20 placeholder:text-gray-400"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="pt-4 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("choose-role")}
                className="border border-emerald-500 text-emerald-300 hover:bg-emerald-500/10 transition-all duration-200"
                disabled={loading}
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>

              <Button
                type="submit"
                className="bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-600 text-white shadow-lg hover:brightness-110 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit for Verification
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
}
