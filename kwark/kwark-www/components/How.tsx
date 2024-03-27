import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "netzo/components/card.tsx";

interface FeatureProps {
  icon?: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    // icon: <MedalIcon />,
    title: "01. Blueprint",
    description:
      "Map your manufacturing supply chain visually. See everything from material and data flow to bottlenecks and gaps. It's the clarity you need to streamline and enhance operations, wrapped in a roadmap to a leaner future.",
  },
  {
    // icon: <MapIcon />,
    title: "02. Integration",
    description:
      "Turn insights into action. Capture only what matters, using the simplest tools that work for your people. No unnecessary software, just the right data at the right time.",
  },
  {
    // icon: <PlaneIcon />,
    title: "03. Empowerment",
    description:
      "Equip your team to make sense of data. We build robust data environments and foster a culture of insight-driven inependence. Your decision-making supercharged.",
  },
  {
    // icon: <GiftIcon />,
    title: "04. Advancement",
    description:
      "Elevate teamwork and communication. We infuse high performance practices into every layer, driving continous growth and celebrating progress with data-driven clarity.",
  },
];

export const How = () => {
  return (
    <section
      id="how-it-works"
      className="container max-w-7xl mx-auto text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        How It{" "}
        <span className="bg-gradient-to-b from-[#36a857]/60 to-[#36a857] text-transparent bg-clip-text">
          Works{" "}
        </span>
        Step-by-Step Guide
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Our services are project based, all starting from 01 Blueprint and
        tailored to your unique needs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {/* {icon} */}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
