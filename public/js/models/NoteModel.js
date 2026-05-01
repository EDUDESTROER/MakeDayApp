export class NoteModel {

    constructor({id, title, parent_id, icon, image, content, created_at, updated_at, is_favorite}){

        this.id = id;
        this.title = title;
        this.parentId = parent_id;
        this.icon = icon;
        this.image = image;
        this.content = content;
        this.createdAt = created_at;
        this.updatedAt = updated_at;
        this.favorite = is_favorite;

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