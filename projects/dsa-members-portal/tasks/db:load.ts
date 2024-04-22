export const FILEPATH = "../../database/db.entries.json";

const kv = await Deno.openKv(Deno.env.get("DENO_KV_PATH"));

export const dbLoad = async () => {
  if (Deno.env.get("DENO_KV_PATH")) {
    if (!confirm("WARNING: Running in production. Continue?")) Deno.exit(0);
  }
  const mod = await import(FILEPATH, { with: { type: "json" } });
  const entries = mod.default as Deno.KvEntry<unknown>[];
  await Promise.all(entries.map(({ key, value }) => kv.set(key, value)));
  console.log("Data uploaded to DB.");

  Deno.exit(0);
};

if (import.meta.main) dbLoad();
