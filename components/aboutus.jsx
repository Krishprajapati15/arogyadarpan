import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function Aboutus() {
  const testimonials = [
    {
      quote:
        "Passionate about building powerful digital products with the blend of Full Stack and AI magic.",
      name: "Krish Prajapati",
      designation: "Full Stack & AI Developer",
      src: "https://avatars.githubusercontent.com/u/174050872?s=400&u=b73aeebc1616d3e29617c9feb14f59230bba2549&v=4",
    },
    {
      quote:
        "Where frontend elegance meets database precision — building systems that just make sense.",
      name: "Jainil Prajapati",
      designation: "Frontend & DataBase Developer",
      src: "https://avatars.githubusercontent.com/u/138965985?s=400&u=9dce490ce9ac505922f1079385409f9a1c422c37&v=4",
    },
    {
      quote:
        "Passionate about building powerful digital products with the blend of Full Stack and AI magic.",
      name: "Krish Prajapati",
      designation: "Full Stack & AI Developer",
      src: "https://avatars.githubusercontent.com/u/174050872?s=400&u=b73aeebc1616d3e29617c9feb14f59230bba2549&v=4",
    },
    {
      quote:
        "Where frontend elegance meets database precision — building systems that just make sense.",
      name: "Jainil Prajapati",
      designation: "Frontend & DataBase Developer",
      src: "https://avatars.githubusercontent.com/u/138965985?s=400&u=9dce490ce9ac505922f1079385409f9a1c422c37&v=4",
    },
    {
      quote:
        "Passionate about building powerful digital products with the blend of Full Stack and AI magic.",
      name: "Krish Prajapati",
      designation: "Full Stack & AI Developer",
      src: "https://avatars.githubusercontent.com/u/174050872?s=400&u=b73aeebc1616d3e29617c9feb14f59230bba2549&v=4",
    },
    {
      quote:
        "Where frontend elegance meets database precision — building systems that just make sense.",
      name: "Jainil Prajapati",
      designation: "Frontend & DataBase Developer",
      src: "https://avatars.githubusercontent.com/u/138965985?s=400&u=9dce490ce9ac505922f1079385409f9a1c422c37&v=4",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
