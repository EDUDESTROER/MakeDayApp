export class EmojiView{

    constructor(container, action){

        this.container = container;
        this.action = action;

    }
    renderEmojis(emoji){

        if(!this.container) return;

        const btn = document.createElement("button");
        btn.className = 'btn-new-note-emojis buttuns-purple-style';
        btn.dataset.action = this.action;
        btn.dataset.emoji = emoji[0];
        btn.textContent = emoji[0];

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