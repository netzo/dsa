export const About = () => {
  return (
    <section
      id="about"
      className="container mx-auto max-w-7xl py-24 sm:py-32"
    >
      <div className="py-12 border rounded-lg bg-muted/50">
        <div className="flex flex-col-reverse gap-8 px-6 md:flex-row md:gap-12">
          {
            /* <img
            src="/assets/pilot.png"
            alt=""
            className="w-[300px] object-contain rounded-lg"
          /> */
          }
          <div className="flex flex-col justify-between bg-green-0">
            <div className="pb-6">
              <h2 className="text-3xl font-bold md:text-4xl">
                An{" "}
                <span className="bg-gradient-to-b from-[#36a857]/60 to-[#36a857] text-transparent bg-clip-text">
                  industry-born solution{" "}
                </span>
                solving a foundational problem
              </h2>
              <p className="mt-4 text-xl text-muted-foreground text-balance">
                Born from urgency—transforming a 40-year-old chemical plant, no
                capital spend, under a year. Those were the forcing functions
                that founded Kwark Group.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
