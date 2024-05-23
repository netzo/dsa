import { defineUnocssConfig } from "netzo/plugins/unocss/plugin.ts";
import { presetNetzo } from "netzo/plugins/unocss/preset-netzo.ts";

const shortcuts = {
  formfield:
    "flex flex-wrap md:grid md:grid-cols-[120px_auto] md:space-y-0 items-left md:items-center mb-2",
  "formfield-date":
    "flex rounded-md border border-input px-3 py-1 text-sm shadow-sm",
  "vehicle-plate-number":
    "font-mono mx-auto p-1 text-sm text-white font-semibold tracking-wider bg-black dark:(text-black bg-white)",
};

export default defineUnocssConfig({
  url: import.meta.url,
  presets: [
    presetNetzo({
      radius: 0.8,
      // "zinc" | "slate" | "stone" | "gray" | "neutral" | "red" | "rose" | "orange" | "green" | "blue" | "yellow" | "violet"
      color: "green",
    }),
  ],
  shortcuts,
  safelist: [
    ...Object.values(shortcuts), // required in case shortcuts used in dynamically mounted components
    "pb-2", // requiried by table in accounts/[id]
    "mdi-plus", // required by FormFieldRelation
    ...("grid grid-cols-2 lg:grid-cols-4 gap-4".split(" ")), // required by accounts/[id]/general cards
  ],
});
