"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Pricing from "@/components/pricing";
import { creditBenefits, features, testimonials } from "@/lib/data";
import { Cover } from "@/components/ui/cover";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { GlobeDemo } from "@/components/world";
import { cn } from "@/lib/utils";
import MacbookTestimonialSection from "@/components/maccard";
import { LinkPreview } from "@/components/ui/link-preview";
import { InfiniteMovingCardsDemo } from "@/components/doctorcards";
import { FeaturesSectionDemo } from "@/components/Bento-grid";
import { AnimatedModalDemo } from "@/components/animate-button";

import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { FileUploadDemo } from "@/components/upload";

export default function Home() {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-8 ml-4">
              <ContainerTextFlip
                className="z-10"
                words={[
                  "🟢 Where Health Meets Technology.",
                  "🟢 Bringing Care to Your Fingertips.",
                  "🟢 Reimagining Healthcare, Digitally.",
                  "🟢 Your Wellness, One Click Away.",
                  "🟢 Smart. Simple. Connected Care.",
                ]}
              />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                <Cover>Your Digital Health</Cover> <br />
                <span className="gradient-title">
                  Revolution <br /> Starts From Here !
                </span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-lg text-justify">
                ArogyaDarpan brings you smart, seamless healthcare connect with
                doctors and manage your health anytime, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 text-white hover:bg-teal-700 z-100"
                >
                  <Link href="/onboarding">
                    Get Started <ArrowRight className="ml-2 h-4 w-4 " />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-emerald-700/30 hover:bg-muted/80 z-100"
                >
                  <Link href="/doctors">Find Doctors</Link>
                </Button>
              </div>
            </div>

            <div className="relative h-[520px] lg:h-[620px] rounded-xl overflow-hidden">
              <GlobeDemo />
            </div>
          </div>
        </div>
        <BackgroundBeams />
      </section>

      <section className="bg-muted/30">
        <div className="relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black">
          <div
            className={cn(
              "absolute inset-0",
              "[background-size:20px_20px]",
              "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
              "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
            )}
          />
          <div className="relative container mx-auto px-4">
            <div className="text-center mb-16 ">
              <h2 className="text-3xl md:text-4xl font-bold  text-white mb-4">
                <Cover>How It Works</Cover>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto z-50">
                Our platform makes healthcare accessible with just a few clicks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-card border-2 border-teal-400/40 hover:border-cyan-400/60 transition-all duration-100 z-100"
                >
                  <CardHeader className="pb-2">
                    <div className="bg-gradient-to-r from-teal-400/80 via-cyan-500/80 to-teal-600/80 p-3 rounded-lg w-fit mb-4">
                      {feature.icon}
                    </div>

                    <CardTitle className="text-xl font-semibold text-white ">
                      <PointerHighlight
                        rectangleClassName="bg-neutral-200 dark:bg-cyan-500/5 border-cyan-300 dark:border-neutral-600 p-3 oy-3"
                        pointerClassName="text-teal-400"
                      >
                        {feature.title}
                      </PointerHighlight>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <ContainerTextFlip
              className="z-10 mb-4"
              words={[
                "✅ Affordable Healthcare",
                "✅ Care Within Reach",
                "✅ Smarter Health Access",
                "✅ Digital First. Doctor Ready",
                "✅ Wellness, Simplified",
              ]}
            />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <LinkPreview url="https://www.krishprajapati.tech/#home">
                Flexible Consultation Plans
              </LinkPreview>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select the plan that suits your health needs — from quick checkups
              to comprehensive care, we’ve got you covered.
            </p>
          </div>

          <div className="mx-auto border-dashed">
            <Pricing />

            <Card className="mt-12 bg-muted/20 border-emerald-900/30 border-dashed">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2 text-emerald-400 -mb-2" />
                  How Credit System Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {creditBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-3 mt-1 bg-emerald-900/20 p-1 rounded-full">
                        <svg
                          className="h-4 w-4 text-emerald-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <p
                        className="text-muted-foreground mt-1"
                        dangerouslySetInnerHTML={{ __html: benefit }}
                      />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-muted/60">
        <div className="relative flex h-[40rem] w-full items-center justify-center bg-white dark:bg-black">
          <div
            className={cn(
              "absolute inset-0",
              "[background-size:20px_20px]",
              "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
              "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
            )}
          />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-6">
              <Badge
                variant="outline"
                className="bg-emerald-900 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4"
              >
                Success Stories
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                Real Experiences. Real Impact.
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover how ArogyaDarpan is transforming lives — from patients
                finding instant care to doctors reaching those in need.
              </p>
            </div>
            <div className="relative z-20">
              <MacbookTestimonialSection />
            </div>
          </div>
        </div>
      </section>

      <InfiniteMovingCardsDemo />
      <FeaturesSectionDemo />
      <AnimatedModalDemo />
      <FileUploadDemo />
    </div>
  );
}
