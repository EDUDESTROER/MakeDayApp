import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import * as regularIcons from "@fortawesome/free-regular-svg-icons";

function extract(iconPack, style){

    return Object.values(iconPack)
        .filter(i => i.iconName)
        .map(i => ({
            name: i.iconName,
            style
        }));

}

const iconMap = {
    solid: extract(solidIcons, "fa-solid"),
    regular: extract(regularIcons, "fa-regular")
};

export const getIcons = (req, res) => {

    const { type = "solid", page = 1, limit = 50 } = req.query;

    const icons = iconMap[type] || iconMap.solid;

    const start = (page - 1) * limit;
    const paginated = icons.slice(start, start + Number(limit));

    res.json(paginated);

};