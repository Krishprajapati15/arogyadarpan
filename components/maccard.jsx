"use client";
import { CardStack } from "./ui/card-stack";
import { cn } from "@/lib/utils";

const Highlight = ({ children, className }) => (
  <span
    className={cn(
      "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
      className
    )}
  >
    {children}
  </span>
);

const CARDS = [
  {
    id: 0,
    name: "Ravi Shah",
    designation: "Working Professional",
    content: (
      <p>
        I had a health scare during travel, and{" "}
        <Highlight>ArogyaDarpan connected me to a doctor</Highlight> within
        minutes. The experience was smooth and life-saving.
      </p>
    ),
  },
  {
    id: 1,
    name: "Sneha Patel",
    designation: "College Student",
    content: (
      <p>
        Managing doctor appointments and health records was a hassle before.{" "}
        <Highlight>ArogyaDarpan made it super convenient</Highlight> to stay on
        top of everything.
      </p>
    ),
  },
  {
    id: 2,
    name: "Dr. Ritesh Mehta",
    designation: "General Physician",
    content: (
      <p>
        As a doctor, I’ve found{" "}
        <Highlight>ArogyaDarpan's platform efficient and easy</Highlight> to
        use. It helps me reach patients who need me in real time.
      </p>
    ),
  },
  {
    id: 3,
    name: "Aarav Desai",
    designation: "Freelancer",
    content: (
      <p>
        What impressed me most was the{" "}
        <Highlight>instant consultation feature</Highlight>. No more waiting
        rooms or delays—just quick, quality care.
      </p>
    ),
  },
];

export default function MacbookTestimonialSection() {
  return (
    <section
      id="testimonials"
      className="relative flex justify-center items-center w-full"
      aria-labelledby="testimonials-heading"
    >
      <div className="relative rounded-[22px] border-2 border-gray-800 shadow-xl w-full max-w-[650px] mx-auto z-[100] bg-gray-900/60">
        <div className="rounded-t-[18px] bg-[#13191d] border-b border-gray-800 px-4 pt-4 pb-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
            <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
          </div>
          <span />
        </div>
        <div className="rounded-b-[18px] bg-[#191f24] flex items-center justify-center min-h-[350px] w-full max-w-[660px]">
          <CardStack items={CARDS} />
        </div>
      </div>
    </section>
  );
}
