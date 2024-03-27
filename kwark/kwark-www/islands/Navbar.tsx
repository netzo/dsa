import { useState } from "preact/hooks";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "netzo/components/navigation-menu.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "netzo/components/sheet.tsx";
import { buttonVariants } from "netzo/components/button.tsx";
import { useDebounceCallback } from "netzo/deps/usehooks-ts.ts";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#services",
    label: "Services",
  },
  {
    href: "#how-it-works",
    label: "How it Works",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const debouncedSetIsOpen = useDebounceCallback(setIsOpen, 5);
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-[#00000030] backdrop-blur">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container flex justify-between w-screen px-4 h-20 ">
          <NavigationMenuItem className="flex font-bold">
            <img src="/icon.svg" alt="Kwark Group" className="w-auto h-16" />
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            {/* <ModeToggle /> */}

            <Sheet open={isOpen} onOpenChange={debouncedSetIsOpen}>
              <SheetTrigger className="px-2" asChild>
                <i
                  className="mdi-menu flex w-5 h-5 md:hidden"
                  onClick={() => debouncedSetIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </i>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold">
                    Kwark Group
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col items-center justify-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
                  <a
                    href="https://www.linkedin.com/company/kwark-group/"
                    target="_blank"
                    className={`w-[110px] border ${
                      buttonVariants({
                        variant: "secondary",
                      })
                    }`}
                  >
                    <i className="mdi-linkedin w-5 h-5" />
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden gap-2 md:flex">
            {routeList.map((route: RouteProps, i) => (
              <a
                href={route.href}
                key={i}
                className={`text-[17px] ${
                  buttonVariants({
                    variant: "ghost",
                  })
                }`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden gap-2 md:flex">
            {
              /* <a
              href="https://www.linkedin.com/company/kwark-group/"
              target="_blank"
            >
              <i className="mdi-linkedin w-6 h-6" />
            </a> */
            }
            <a
              href="mailto:sebastian@kwark.group"
              target="_blank"
            >
              Contact us
            </a>

            {/* <ModeToggle /> */}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
