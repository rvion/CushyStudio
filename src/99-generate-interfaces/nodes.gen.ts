import JsonToTS from 'https://deno.land/x/json_to_ts@v1.7.0/mod.ts'
import { config } from 'https://deno.land/x/dotenv@v3.2.2/mod.ts'

const SERVER_IP = config().SERVER_IP
const res = await fetch(`http://${SERVER_IP}/object_info`)
const rawJSON = await res.text()
const json = JSON.parse(rawJSON)
const out = ['// deno-lint-ignore-file'].concat(JsonToTS(json))
Deno.writeTextFileSync('./src/nodes.types.ts', out.join('\n'))
