export class CategoryModel {

    constructor({id, title, view_mode, parentId, created_at, updated_at}){

        this.id = id;
        this.title = title;
        this.viewMode = view_mode;
        this.parentId = parentId;
        this.createdAt = created_at;
        this.updatedAt = updated_at;

    }

    updateTitle(newTitle){

        this.title = newTitle;

    }
    updateViewMode(newViewMode){

        this.viewMode = newViewMode;

    }

}