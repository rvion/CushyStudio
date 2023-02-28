import JsonToTS from "https://deno.land/x/json_to_ts@v1.7.0/mod.ts";

const rawJSON = await Deno.readTextFile("./spec/nodes-2023-02-28.json");
const json = JSON.parse(rawJSON);
const out = ["// deno-lint-ignore-file"].concat(JsonToTS(json));
await Deno.writeTextFile("./src/nodes.ts", out.join("\n"));
