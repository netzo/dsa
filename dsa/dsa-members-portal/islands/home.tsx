import { Button, buttonVariants } from "netzo/components/button.tsx";
import { ScrollArea, ScrollBar } from "netzo/components/scroll-area.tsx";
import { Separator } from "netzo/components/separator.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "netzo/components/tabs.tsx";
import { cn } from "netzo/components/utils.ts";
import type { Amenity } from "../../database/amenities.ts";
import type { Notice } from "../../database/notices.ts";

export function PageHome(props: { amenities: Amenity[]; notices: Notice[] }) {
  const { amenities, notices } = props;
  return (
    <div className="h-full px-4 py-6 lg:px-8">
      <Tabs defaultValue="overview" className="h-full space-y-6">
        <div className="space-between flex items-center">
          <TabsList>
            <TabsTrigger value="overview" className="relative">
              Actualidad
            </TabsTrigger>
            <TabsTrigger value="about">
              Acerca del Club
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto mr-4">
            <Button className={cn(buttonVariants({ variant: "default" }))}>
              Nueva Reserva
            </Button>
          </div>
        </div>
        <TabsContent
          value="overview"
          className="border-none p-0 outline-none"
        >
          <PageHomeIndex {...props} />
        </TabsContent>
        <TabsContent
          value="about"
          className="h-full flex-col border-none p-0 data-[state=active]:flex"
        >
          <PageHomeAbout />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function PageHomeIndex(props: {
  amenities: Amenity[];
  notices: Notice[];
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Próximos Eventos
          </h2>
          <p className="text-sm text-muted-foreground">
            No te pierdas estos eventos próximos. ¡Reserva tu lugar!
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {props.amenities.map((item) => (
              <a href={`/amenities/events`}>
                <ItemCard
                  key={item.name}
                  item={item}
                  className="w-[250px]"
                  aspectRatio="portrait"
                  width={250}
                  height={330}
                />
              </a>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Últimos Avisos
        </h2>
        <p className="text-sm text-muted-foreground">
          Entérate de las últimas noticias del club.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {props.notices.map((item) => (
              // <a href={`/publications/${item.id}`}>
              <a href={`/notices`}>
                <ItemCard
                  key={item.name}
                  item={item}
                  className="w-[150px]"
                  aspectRatio="square"
                  width={150}
                  height={150}
                />
              </a>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}

export function PageHomeAbout() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Acerca del Club
          </h2>
          <p className="text-sm text-muted-foreground">
            Nuestro club nace en 1977 con la ilusión de generar un espacio donde
            se pudiera fomentar los lazos familiares, la amistad y los buenos
            hábitos a través del deporte.
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <article className="grid grid-cols-2 gap-8 p-4 text-sm">
        <p>
          Es un placer recibirte en nuestro club, un club privado que es hecho
          especialmente para ti, solo para que tú y los tuyos lo
          disfruten.<br />
          <br />

          Considerado como uno de los mejores en el norte de México, el San
          Agustín te ofrece el espacio ideal para el sano desarrollo integral de
          tu familia, donde nos reúne la amistad, el placer de hacer lo que nos
          gusta, con quien más queremos, nuestra familia y amigos.<br />
          <br />

          Un espacio normado por un consejo directivo y basado en un enfoque de
          política de mejoras continuas, con el objetivo de satisfacer las
          necesidades de nuestra membresía, bajo un alto estándar de
          servicio.<br />
          <br />

          Somos un club de amigos con un objetivo común: disfrutar juntos de
          nuestras aficiones y de los eventos sociales y culturales que
          ofrecemos para todos.<br />
          <br />

          Gracias por tu confianza, gracias por tu preferencia al estar en este
          lugar privilegiado de la naturaleza, y de su espléndida ubicación, un
          lugar que nos hace sentirnos orgullosos de pertenecer a esta gran
          familia.<br />
          <br />
        </p>
        <img
          src="https://deportivosanagustin.com/images/demo/portadapic.png"
          alt="Club San Agustín"
        />
      </article>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Enlaces de Interés
          </h2>
          <p className="text-sm text-muted-foreground">
            Enlaces de interés para los miembros del club.
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <article className="grid grid-cols-2 gap-8 p-4 text-sm">
        <p>
          <ul className="list-disc ml-6">
            <li>
              <a href="/reglamento-interior.pdf">
                Reglamento interior
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/deportivosanagustin/"
                target="_blank"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/deportivo-san-agust%C3%ADn"
                target="_blank"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/@deportivosanagustin1855"
                target="_blank"
              >
                YouTube
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/deportivosanagustin"
                target="_blank"
              >
                Facebook
              </a>
            </li>
          </ul>
        </p>
        <div />
      </article>
    </>
  );
}

interface ItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  item: Amenity | Notice;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export function ItemCard({
  item,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: ItemCardProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md">
        <img
          src={item.image}
          alt={item.name}
          width={width}
          height={height}
          className={cn(
            "h-auto w-auto object-cover transition-all hover:scale-105",
            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
          )}
        />
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{item.name}</h3>
        <p className="text-xs text-muted-foreground">{item.artist}</p>
      </div>
    </div>
  );
}
