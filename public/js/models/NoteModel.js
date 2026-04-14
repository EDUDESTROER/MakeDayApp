export class NoteModel {

    constructor({id, title, parentId, icon, image, content, createdAt, updatedAt}){

        this.id = id;
        this.title = title;
        this.parentId = parentId;
        this.icon = icon;
        this.image = image;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

    }

    updateTitle(newTitle){

        this.title = newTitle;

    }
    updateIcon(icon){

        this.icon = icon;

    }
    updateImage(image){

        this.image = image;

    }
    updateContent(content){

        this.content = content;

    }
    updateParentId(parentId){

        this.parentId = parentId;

    }

}