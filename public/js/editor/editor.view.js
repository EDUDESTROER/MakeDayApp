export class editorView{

    constructor(){

        this.editorEl = document.querySelector('#note-content');

    }

    renderBlock(block){

        let element;

        //console.log(block);

        switch (block.type) {
            case 'paragraph':
                element = this.createParagraph(block.content);
            break;
        }

        element.contentEditable = true;
        element.dataset.blockId = block.id;

        return element;

    }

    createParagraph(content){

        let paragraphEl = document.createElement('p');

        paragraphEl.innerText = content;

        paragraphEl.classList.add('editor-paragraph');

        return paragraphEl;

    }

    appendBlock(block){

        this.editorEl.appendChild(block);

    }
    getEditorEl(){
        return this.editorEl;
    }

    cleanEditor(){

        this.editorEl.innerHTML = '';

    }

}