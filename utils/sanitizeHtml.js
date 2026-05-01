import sanitizeHtml from "sanitize-html";

function sanitizeText(text) {

    return sanitizeHtml(text, {
        allowedTags: [],
        allowedAttributes: {}
    }).trim();

}

export function sanitizeNote(note) {

    const cloned = structuredClone(note);

    if(typeof cloned.title === "string"){

        cloned.title = sanitizeText(cloned.title);

    }

    if(cloned.content?.byId){

        for (const block of Object.values(cloned.content.byId)){

            if (typeof block.content === "string") {
                block.content = sanitizeText(block.content);
            }

        }

    }

    return cloned;

}
export function sanitizeCategory(note) {

    const cloned = structuredClone(note);

    if(typeof cloned.title === "string"){

        cloned.title = sanitizeText(cloned.title);

    }

    return cloned;

}