import { Button } from "netzo/components/button.tsx";

export const Cta = () => {
  return (
    <section
      id="cta"
      className="bg-muted/50 py-16 my-24 sm:my-32"
    >
      <div className="container mx-auto max-w-7xl lg:grid lg:grid-cols-2 place-items-center">
        <div className="lg:col-start-1">
          <h2 className="text-3xl md:text-4xl font-bold ">
            Act now.
            <span className="bg-gradient-to-b from-[#36a857]/60 to-[#36a857] text-transparent bg-clip-text">
              Shape tomorrow.
            </span>
          </h2>
          <p className="text-muted-foreground text-balance text-xl mt-4 mb-8 lg:mb-0">
            The future isn't just approaching—it's here. Don't wait for change;
            drive it. Fill out the form below, and let's start crafting your
            tomorrow today. A member of our team will connect with you within
            one business day.
          </p>
        </div>

        <div className="space-y-4 lg:col-start-2">
          <Button
            href="mailto:sebastian@kwark.group"
            target="_blank"
            className="w-full bg-[#36a857]
          md:mr-4 md:w-auto"
          >
            Contact us
          </Button>
          {
            /* <Button
            variant="outline"
            className="w-full md:w-auto"
          >
            View all features
          </Button> */
          }
        </div>
      </div>
    </section>
  );
};
