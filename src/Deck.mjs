export class Deck {                                                
    constructor(name, id, colors = ["colorless"]) {
        this.name = name;
        this.id = id;
        this.cards = [];
        this.colors = colors;   
    }

    getCard(id) {
        return this.cards.find( card => (card.id === id));      // return card
    }

    addCard(name, id, qty = 1) {
        let card = this.getCard(id);                            // check for existence of card
        if (!card) {
            this.cards.push(new Card(name, id, qty));           // if not yet added, then add it
            return true;
        }
        else if (card.qty + qty <= 4) {                         // otherwise, if there's space
            card.qty += qty;                                    // increase # of copies
            return true;
        }
        return false;                                           // else don't add anything
    }

    updateCardQty(id, qty) {
        let card = this.getCard(id);                            // get card
        const delta = qty - card.qty;                           // calc difference: resulting qty - prev qty
        if (qty == 0) {                                         // if new qty is zero,
            const index = this.cards.indexOf(card);
            this.cards.splice(index, 1);                        // remove that card's instance
        }
        else card.qty = qty;                                    // otherwise update # of copies
        return delta;                                           // return the difference
    }

    removeCard(id) {
        const index = this.cards.findIndex((card) => (card.id === id));
        const numRemoved = this.cards[index].qty;               // how many will be deleted
        this.cards.splice(index, 1);                            // remove card
        return numRemoved;                                      // return # deleted
    }

    removeAllCards() {
        this.cards.length = 0;
    }

    sortByName() {
        this.cards.sort(this.compareNames);
    }

    compareNames = (a,b) => {                                   // compare function based on name properties
        if(a.name > b.name) return 1;
        if(a.name == b.name) return 0;
        if(a.name < b.name) return -1; 
    }
}

class Card {
    constructor(name, id, qty) {
        this.name = name;
        this.id = id;
        this.qty = qty;
    }
}