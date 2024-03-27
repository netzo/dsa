import { Button } from "netzo/components/button.tsx";

export const Hero = () => {
  return (
    <section className="container mx-auto max-w-7xl py-20 md:py-48 gap-10">
      <div className="space-y-6 justify-center text-center">
        {/* <img src="/icon.svg" alt="Kwark" className="h-48 w-auto mx-auto" /> */}
        <main className="text-center text-balance font-bold text-5xl md:text-6xl">
          <h1 className="inline">
            The solution for{" "}
            <span className="text-[#36a857]" style={{ whiteSpace: "nowrap" }}>
              next-gen
            </span>{" "}
            manufacturing leaders
          </h1>
        </main>

        <p className="text-xl text-muted-foreground mx-auto max-w-3xl text-center">
          Our solutions help the future leaders carry on the manufacturing
          legacy by improving their schedule adherence with a unique approach.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button
            href="#contact"
            className="bg-[#36a857]"
          >
            Contact us
          </Button>
          <Button
            href="#services"
            className="bg-transparent text-primary ring-primary"
          >
            Explore the possibilities
          </Button>
        </div>
      </div>
    </section>
  );
};
