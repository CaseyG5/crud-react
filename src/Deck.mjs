export default class Deck {                                                
    constructor(name, id, colors = ["colorless"]) {
        this.name = name;
        this.id = id;
        this.cards = [];
        this.colors = colors;    
    }

    addCard(name, id, qty = 1) {
        for(let i = 0; i < qty; i++) {
            this.cards.push(new Card(name, id));
        }
    }

    removeCard(id) {
        let index = this.cards.findLastIndex( card => (card.id === id));
        if(index === -1) return false; 
        this.cards.splice( index, 1 );
        return true;
    }

    removeAllCards() {
        this.cards.length = 0;
    }
}

class Card {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}