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

export { NetzoToolbar } from "netzo/components/blocks/netzo-toolbar.tsx";

export const Nav = (props: { state: NetzoState }) => {
  return (
    <NavRoot>
      <NavHeader title="TPS Armoring" image="/logo.png" />
      <NavSeparator />
      <NavItem icon="mdi-view-dashboard" text="Dashboard" href="/" exact />
      <NavItem
        icon="mdi-radiobox-marked"
        text="Incidents"
        href="/incidents"
      />
      <NavSeparator />
      <NavItem icon="mdi-car-multiple" text="Units" href="/units" />
      {/* <NavItem icon="mdi-car-select" text="Models" href="/models" /> */}
      <NavItemHeader text="MS Dynamics 365" className="mt-6" />
      <NavItem
        icon="mdi-microsoft-dynamics-365 text-[#1358D0]"
        text="Product Groups"
        href="/product-groups"
      />
      <NavSpacer />
      <NavSeparator />
      <NavItemUser state={props.state} />
    </NavRoot>
  );
};
