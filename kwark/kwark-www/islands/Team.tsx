import { buttonVariants } from "netzo/components/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "netzo/components/card.tsx";

interface TeamProps {
  imageUrl: string;
  name: string;
  position: string;
  socialNetworks: SociaNetworkslProps[];
}

interface SociaNetworkslProps {
  name: string;
  url: string;
}

const teamList: TeamProps[] = [
  {
    imageUrl:
      "https://media.licdn.com/dms/image/D5603AQEL946pDlV_vQ/profile-displayphoto-shrink_400_400/0/1701726158864?e=1714003200&v=beta&t=qjQpnrEvHhIbP_QFs31Th3CNKHhsp5XFayOxnjrZspQ",
    name: "Sebastian Gonzalez",
    position: "CEO",
    socialNetworks: [
      {
        name: "Linkedin",
        url: "https://www.linkedin.com/in/sebastian-gonzalez-karam/",
      },
    ],
  },
  {
    imageUrl: "https://i.pravatar.cc/150?img=60",
    name: "Mario Gonzalez",
    position: "Tech Lead",
    socialNetworks: [
      { name: "Linkedin", url: "http://linkedin.com" },
    ],
  },
  {
    imageUrl: "https://i.pravatar.cc/150?img=36",
    name: "Hector Moreno",
    position: "Frontend Developer",
    socialNetworks: [
      { name: "Linkedin", url: "http://linkedin.com" },
    ],
  },
  {
    imageUrl: "https://i.pravatar.cc/150?img=17",
    name: "Suzanne Karam",
    position: "Backend Developer",
    socialNetworks: [
      { name: "Linkedin", url: "http://linkedin.com" },
    ],
  },
];

export const Team = () => {
  const socialIcon = (iconName: string) => {
    switch (iconName) {
      case "Linkedin":
        return <i className="mdi-linkedin" size="20" />;

      case "Facebook":
        return <i className="mdi-facebook" size="20" />;

      case "Instagram":
        return <i className="mdi-instagram" size="20" />;
    }
  };

  return (
    <section
      id="team"
      className="container mx-auto max-w-7xl py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold">
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Our Dedicated{" "}
        </span>
        Crew
      </h2>

      <p className="mt-4 mb-10 text-xl text-muted-foreground">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis
        dolor pariatur sit!
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-10">
        {teamList.map(
          ({ imageUrl, name, position, socialNetworks }: TeamProps) => (
            <Card
              key={name}
              className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center"
            >
              <CardHeader className="mt-8 flex justify-center items-center pb-2">
                <img
                  src={imageUrl}
                  alt={`${name} ${position}`}
                  className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
                />
                <CardTitle className="text-center">{name}</CardTitle>
                <CardDescription className="text-primary">
                  {position}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center pb-2">
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              </CardContent>

              <CardFooter>
                {socialNetworks.map(({ name, url }: SociaNetworkslProps) => (
                  <div key={name}>
                    <a
                      href={url}
                      target="_blank"
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      })}
                    >
                      <span className="sr-only">{name} icon</span>
                      {socialIcon(name)}
                    </a>
                  </div>
                ))}
              </CardFooter>
            </Card>
          ),
        )}
      </div>
    </section>
  );
};
