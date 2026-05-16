import emojis from "unicode-emoji-json" assert { type: "json" };
import { writeFileSync } from "fs";

writeFileSync(
    "./public/icons/emojis.json",
    JSON.stringify(emojis, null, 2)
);