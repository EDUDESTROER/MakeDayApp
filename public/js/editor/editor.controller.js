import { editorView } from "./editor.view.js";

export class EditorController{

    constructor(noteController){

        this.state = null;
        this.editorView = new editorView();
        this.startEditor();
        this.noteController = noteController;

    }

    setContent(content){

        //console.log(content);

        this.state = content;
        

    }
    getContent(){

        return this.state;

    }
    render(){

        this.editorView.cleanEditor();

        const { byId, rootIds } = this.state;

        rootIds.forEach(id => {
            
            const block = byId[id];
            const blockElement = this.editorView.renderBlock(block);

            this.editorView.appendBlock(blockElement);

        });

    }
    startEditor(){

        const editorEl = this.editorView.getEditorEl();

        editorEl.addEventListener('keydown', e => {

            const blockEl = e.target.closest('[data-block-id');

            if(!blockEl) return;

            const blockId = blockEl.dataset.blockId;

            this.handleKey(e, blockId);

        });
        editorEl.addEventListener('input', e => {

            const blockEl = e.target.closest('[data-block-id');

            if(!blockEl) return;

            const blockId = blockEl.dataset.blockId;

            this.handleInput(e, blockId);

        });

    }

    handleKey(e, blockId){

        //console.log('In handle key: ', e.key, blockId);

        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                this.createNewBlockAfter(blockId);
            break;
        }

    }
    handleInput(e, blockId){

        this.updateContent(e.target.textContent, blockId);

    }
    createNewBlockAfter(currentBlockId){

        const type = this.state.byId[currentBlockId].type;
        const id = crypto.randomUUID();

        const currentBlock = this.state.byId[currentBlockId];
        const parentId = currentBlock.parentId;

        /*console.log('New block info: ');
        console.log(type);
        console.log(id);*/

        const newBlock = {
            id,
            type,
            content: '',
            children: [],
            parentId: null
        }

        if(type === 'paragraph'){

            this.state.byId[id] = newBlock;

            if (parentId === null){

                const index = this.state.rootIds.indexOf(currentBlockId);

                this.state.rootIds.splice(index + 1, 0, id);

            }else{
                
                const brothers = this.state.byId[parentId].children;

                const index = brothers.index(currentBlockId);

                brothers.splice(index + 1, 0, id);

            }

            //console.log('New block: ', this.state);

            this.render();

        }

    }
    updateContent(content, blockId){

        this.state.byId[blockId].content = content;

        //console.log(this.state.byId[blockId]);

        this.scheduleSave();

    }
    scheduleSave(){

        if(this.scheduleTimeout) clearTimeout(this.scheduleTimeout);

        this.scheduleTimeout = setTimeout(()=>{

            this.noteController.setContent(this.state);

            this.noteController.saveNote();

        }, 800);

    }

}