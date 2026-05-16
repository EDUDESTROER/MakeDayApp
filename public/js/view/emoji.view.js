export class EmojiView{

    constructor(){

        this.container = document.querySelector('.new-note-emojis');

    }
    renderEmojis(emoji){

        if(!this.container) return;

        const btn = document.createElement("button");
        btn.className = 'btn-new-note-emojis buttuns-purple-style';
        btn.dataset.action = 'select-new-note-emoji';
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