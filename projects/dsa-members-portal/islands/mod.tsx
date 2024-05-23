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
      <a href="/">
        <NavHeader title="San Agustin" image="/symbol.svg" />
      </a>
      <NavSeparator />
      {/* <NavItem icon="mdi-home" text="Inicio" href="/" exact={true} /> */}
      <NavItemHeader text="Gestión" />
      <NavItem
        icon="mdi-wallet-membership"
        text="Mi Acción"
        href={`/accounts/${ACCOUNT_ID}`}
      />
      {
        /* <NavItem
        icon="mdi-account-group"
        text="Mi Perfil"
        href={`/users/${USER_ID}`}
      /> */
      }
      <NavItemHeader text="Información" />
      <NavItem
        icon="mdi-dots-grid"
        text="Amenidades"
        href="/amenities/services"
      />
      <NavItem
        icon="mdi-nature-people"
        text="Instalaciones"
        href="/facilities"
      />
      <NavItemHeader text="Comunidad" />
      <NavItem icon="mdi-newspaper" text="Avisos" href="/notices" />
      <NavItem icon="mdi-store" text="Publicaciones" href="/publications" />
      <NavItemHeader text="Reservas" />
      <NavItem
        icon="mdi-calendar-clock"
        text="Mis Reservas"
        href={`/bookings?userId=${USER_ID}`}
      />
      <NavSpacer />
      <NavSeparator />
      <NavItemUser state={props.state} />
    </NavRoot>
  );
};
