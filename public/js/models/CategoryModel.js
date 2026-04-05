export class CategoryModel {

    constructor({id, title, viewMode, parentId, createAt}){

        this.id = id;
        this.title = title;
        this.viewMode = viewMode;
        this.parentId = parentId;
        this.createAt = createAt;

    }

    updateTitle(newTitle){

        this.title = newTitle;

    }
    updateViewMode(newViewMode){

        this.viewMode = newViewMode;

    }

}