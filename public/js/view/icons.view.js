export class IconsView{

    constructor(){

        this.container = document.querySelector('.new-note-icons');

    }

    renderIcons(icon){

        if(!this.container) return;

        const btn = document.createElement("button");
        btn.className = 'btn-new-note-icons buttuns-purple-style';
        btn.dataset.action = 'select-new-note-icon';
        btn.dataset.style = icon.style;
        btn.dataset.icon = icon.name;
            
        const i = document.createElement("i");
        i.className = `${icon.style} ${icon.name}`;

        btn.appendChild(i);

        this.container.appendChild(btn);

    }
    cleanContainer(){
        this.container.innerHTML = '';
    }
    hiddenLoadMore(btn){

        btn.style.display = 'none';

    }
    showLoadMore(btn){

        btn.style.display = 'block';

    }

}