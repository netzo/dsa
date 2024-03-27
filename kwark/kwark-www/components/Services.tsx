import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "netzo/components/card.tsx";

import { Badge } from "netzo/components/badge.tsx";

interface ServiceProps {
  title: string;
  description: string;
  icon: string | JSX;
}

const serviceList: ServiceProps[] = [
  {
    title: "Reality Check",
    description:
      "Legacy operations lack speed, clarity, and efficiency. Next-gen manufacturing leaders, it's time to evolve or fall behind even more.",
    icon: <i className="mdi-check-circle" />,
  },
  {
    title: "Myth Busted",
    description:
      "More ERP modules on unrefined operations? That's just costly clutter. Superficial solutions will not evolve your operation.",
    icon: <i className="mdi-bullseye" />,
  },
  {
    title: "Enough Talk",
    description:
      "We got real in manufacturing, cutting through the noise of overhyped software and endless consultant pitches. Our hands-on experience shaped a unique solution.",
    icon: <i className="mdi-rocket" />,
  },
];

export const Services = () => {
  return (
    <section
      id="services"
      className="container mx-auto max-w-7xl py-24 sm:py-32"
    >
      <div className="grid grid-cols-2 place-items-center">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold md:text-left">
            <span className="bg-gradient-to-b from-[#36a857]/60 to-[#36a857] text-transparent bg-clip-text">
              We solve
            </span>{" "}
            the common problems in{" "}
            <span className="bg-gradient-to-b from-[#36a857]/60 to-[#36a857] text-transparent bg-clip-text">
              legacy operations
            </span>
          </h2>

          {
            /* <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            Legacy operations lack speed, clarity, and efficiency. Guara
          </p> */
          }

          <div className="flex flex-col gap-8 mt-8">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="items-center justify-center text-[#36a857] tex-3xl">
                    {icon}
                  </div>

                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <img
          src="assets/cube-leg.png"
          className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
          alt="About services"
        />
      </div>
    </section>
  );
};
