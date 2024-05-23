import { IS_BROWSER } from "$fresh/runtime.ts";
import { type Signal } from "@preact/signals";
import { qrcode } from "jsr:@libs/qrcode";
import { download, generateCsv, mkConfig } from "npm:export-to-csv@1.2.4";
import { flatten } from "npm:flat@6.0.1";
import { format } from "npm:timeago.js@4.0.0-beta.3";
import { StateUpdater } from "preact/hooks";
import { OpeningHours, Organizers, Vehicles, Verifications } from "./mod.ts";

export const toQRCode = (content: string) => {
  const svg = qrcode(content, { output: "svg" });
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const toTimeAgo = (value: string | number | Date) => {
  return format(value, "es_ES");
};

export const toDate = (dateTime: string) => {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const toDateTime = (dateTime: string) =>
  new Date(dateTime).toLocaleString("en-GB", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const toMXN = (amount: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
    currencyDisplay: "symbol",
  }).format(amount);

export const toUSD = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

// export const currencyLocalProps = (amount: number) => ({
//   value: (amount),
//   onBlur: (e: Event) => e.currentTarget.value = toMXN(Number(e.currentTarget.value)),
//   onFocus: (e: Event) => e.currentTarget.value = Number(e.currentTarget.value),
//   onChangeCapture: (e: Event) => Number(e.currentTarget.value),
// });

export const toPercent = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
  }).format(value);

export const getYearsFromToday = (years = 0) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + years);
  return date;
};

export const getMonthsFromToday = (months = 0) => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
};

export const getDaysFromToday = (days = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

// adapted from https://stackoverflow.com/a/66494926
export const toHslColor = (
  value: string,
  saturation = 75,
  lightness = 50,
  opacity = 1,
) => {
  const stringUniqueHash = [...value].reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  const hue = Math.abs(stringUniqueHash % 360);
  return `hsl(${hue} ${saturation}% ${lightness}% / ${opacity})`;
};

export const generateHexColor = () => {
  // Generate a random integer between 0 and 255 for red, green, and blue
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  // Convert the integer values to hexadecimal and pad with zeros if necessary
  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");

  // Concatenate the hex values to form a full hex color code
  return `#${hexR}${hexG}${hexB}`;
};

export const getVerifications = (data?: Partial<Verifications>) => ({
  owner: true,
  users: false,
  payments: true,
  vehicles: true,
  ...data,
});

export const getVehicles = (data?: Partial<Vehicles>) => ({
  brand: "",
  model: "",
  year: 2014,
  color: "",
  plateNumber: "",
  ...data,
});

export const getOrganizers = (data?: Partial<Organizers>) => ({
  name: "",
  userId: "",
  email: "",
  phone: "",
  ...data,
});

export const getOpeningHours = (data?: Partial<OpeningHours>) => ({
  monday: "",
  tuesday: "",
  wednesday: "",
  thursday: "",
  friday: "",
  saturday: "",
  sunday: "",
  festiveDays: "",
  ...data,
});

// used for `row.original.openinigHours[getDay]` to select current day opening hours
export const getDay = (index?: number) =>
  ({
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  })?.[index ?? new Date().getDay()];

export const updateSearchParam = (key: string, value: string) => {
  if (!IS_BROWSER) return;
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.pushState({}, "", url.toString());
};

export function useTableUtils<
  TData = { id: string; name: string; [k: string]: unknown },
>({
  endpoint,
  data,
  setData,
  active,
}: {
  endpoint: string;
  data: TData[];
  setData: StateUpdater<TData[]>;
  active?: Signal<TData>;
}) {
  const create = async (value: TData) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(value),
    });
    if (response.ok) {
      const result = await response.json();
      setData([result, ...data]);
      if (active) active.value = result;
      return result;
    }
  };

  const update = async (value: TData) => {
    const response = await fetch(`${endpoint}/${value.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(value),
    });
    const result = await response.json();
    if (active) active.value = result;
    setData(
      data.map((value) => value.id === result.id ? result : value),
    );
    return result;
  };

  const duplicate = async ({ id: _, ...value }: TData) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(value),
    });
    if (response.ok) {
      const result = await response.json();
      setData([result, ...data]);
      if (active) active.value = result;
      return result;
    }
  };

  const remove = async ({ id }: TData) => {
    const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    if (response.ok) {
      const result = await response.json();
      if (confirm("Estas seguro de eliminar este registro?")) {
        setData(data.filter((value) => value.id !== id));
        if (active) active.value = undefined;
        return result;
      }
    }
  };

  const copyId = ({ id }: TData) =>
    globalThis?.navigator.clipboard.writeText(id as string);

  // see https://medium.com/@j.lilian/how-to-export-react-tanstack-table-to-csv-file-722a22ccd9c5
  const downloadAsCsv = (data: TData[], filename: string) => {
    const csvConfig = mkConfig({
      fieldSeparator: ",",
      filename, // export file name (without .csv)
      decimalSeparator: ".",
      useKeysAsHeaders: true,
    });
    const flatData = data.map((row) => flatten(row));
    // deno-lint-ignore no-explicit-any
    const csv = generateCsv(csvConfig)<any>(flatData);
    download(csvConfig)(csv);
  };

  return {
    active,
    create,
    update,
    duplicate,
    remove,
    copyId,
    downloadAsCsv,
  };
}

export * from "@/database/accounts.ts";
export * from "@/database/amenities.ts";
export * from "@/database/bookings.ts";
export * from "@/database/facilities.ts";
export * from "@/database/items.ts";
export * from "@/database/menus.ts";
export * from "@/database/notices.ts";
export * from "@/database/orders.ts";
export * from "@/database/publications.ts";
export * from "@/database/sessions.ts";
export * from "@/database/slots.ts";
export * from "@/database/statements.ts";
export * from "@/database/users.ts";
export * from "@/database/vehicles.ts";
