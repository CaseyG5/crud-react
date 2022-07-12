import axios from 'axios';

const URL = '/api/decks';

class DecksAPI {
    getAllDecks = async () => {
        try {
            const resp = await axios.get(URL);
            return await resp.data;
        } catch(error) {  console.log('Oops, could not GET decks.', error);  }
    }

    getDeck = async (id) => {
        try {
            const resp = await axios.get(`${URL}/${id}`);
            return resp.data.deck;                     
        } catch(error) {  console.log('Oops, could not GET deck.', error);  }
    }

    getCard = async (name) => {
        try {
            const resp = await axios.get(`/api/cards/${name}`);
            return resp.data;                                                
        } catch(error) {  console.log('Oops, could not GET card.', error);  }
    }

    createDeck = async (name) => {
        try {
            const resp = await axios.post(URL, { "name": name });
            return resp.data.deck;                     
        } catch(error) {  console.log('Oops, could not POST new deck.', error);  }
    }

    updateDeck = async (deck) => {
        try {
            const resp = await axios.put(`${URL}/${deck.id}`, deck);
            return resp.data.deck;                     
        } catch(error) {  console.log('Oops, could not UPDATE deck.', error);  }
    }

    deleteDeck = async (id) => {
        try {
            const resp = await axios.delete(`${URL}/${id}`);
            return resp.data.msg;                     
        } catch(error) {  console.log('Oops, could not DELETE deck.', error);  }
    }
}

export const decksApi = new DecksAPI();