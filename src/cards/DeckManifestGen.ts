import { writeFileSync } from 'fs'
import { DeckSchema } from './DeckManifest'

writeFileSync(
    //
    'src/cards/DeckManifest.schema.json',
    JSON.stringify(DeckSchema, null, 4),
)
