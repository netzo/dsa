import {
  NavHeader,
  NavItem,
  NavItemHeader,
  NavItemUser,
  NavRoot,
  NavSeparator,
  NavSpacer,
} from "netzo/components/blocks/nav.tsx";
import type { NetzoState } from "netzo/mod.ts";

// export { NetzoToolbar } from "netzo/components/blocks/netzo-toolbar.tsx";

export const USER_ID = "6VKHRW7WPHHD01FARM1YNTG92F";
export const ACCOUNT_ID = "01HRW7WPRM1YNTG92HFA6VKHDF";

export const Nav = (props: { state: NetzoState }) => {
  return (
    <NavRoot {...props}>
      <NavHeader title="San Agustin" image="/symbol.svg" />
      <NavSeparator />
      <NavItem icon="mdi-home" text="Inicio" href="/" exact={true} />
      <NavItem
        icon="mdi-calendar-clock"
        text="Mis Reservas"
        href={`/bookings?userId=${USER_ID}`}
      />
      <NavItem icon="mdi-dots-grid" text="Instalaciones" href="/facilities" />
      <NavItemHeader text="Comunidad" />
      <NavItem icon="mdi-newspaper" text="Avisos" href="/notices" />
      <NavItem icon="mdi-store" text="Publicaciones" href="/publications" />
      <NavItemHeader text="Amenidades" />
      <NavItem icon="mdi-calendar" text="Eventos" href="/amenities/events" />
      <NavItem
        icon="mdi-food"
        text="Gastronomia"
        href="/amenities/food-and-drinks"
      />
      <NavItem
        icon="mdi-weight-lifter"
        text="Deportes"
        href="/amenities/sports"
      />
      <NavItem
        icon="mdi-room-service"
        text="Servicios"
        href="/amenities/services"
      />
      <NavSpacer />
      <NavItem
        icon="mdi-account-group"
        text="Mi Perfil"
        href={`/users/${USER_ID}`}
      />
      <NavItem
        icon="mdi-wallet-membership"
        text="Mi Acción"
        href={`/accounts/${ACCOUNT_ID}`}
      />
      <NavSeparator />
        <span
          title={props.state.denoJson.description}
          className="text-xs text-muted-foreground"
        >
          {props.state.denoJson.name}@{props.state.denoJson.version}
        </span>
      <NavItemUser state={props.state} />
    </NavRoot>
  );
};
