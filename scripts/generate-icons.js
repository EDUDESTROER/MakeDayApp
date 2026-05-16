import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { writeFileSync } from "fs";
import { array } from "zod";

function extract(iconPack, stylePrefix) {

    const uniqueNames = new Set();

    Object.values(iconPack)
        .filter(icon => typeof icon === "object" && icon.iconName)
        .forEach(icon =>{
            uniqueNames.add(icon.iconName);
        });

    return Array.from(uniqueNames).map(name => ({
        name: `fa-${name}`,
        style: stylePrefix
    }));
    

}

const iconMap = {
    solid: extract(fas, "fa-solid"),
    regular: extract(far, "fa-regular")
};

writeFileSync(
    "./public/icons/icons.json",
    JSON.stringify(iconMap, null, 2)
);

console.log("icons.json sucess!");