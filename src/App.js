import React from 'react';
import { decksApi } from './DecksAPI';
import NewDeckForm from './Components/NewDeckForm';
import DeckEntries from './Components/DeckEntries';
import Deck from './Components/DeckItem';
import DeckEditor from './Components/DeckEditor';
import './App.css';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      allDecks: [],
      currentDeck: null
    }

    this.refreshList = this.refreshList.bind(this);
    this.editDeck = this.editDeck.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.deleteDeck = this.deleteDeck.bind(this);
  }

  async editDeck(id) {
    const deck = await decksApi.getDeck(id);
    this.setState( {currentDeck: deck} );
  }

  cancelEdit() {
    this.setState( {currentDeck: null} );
  }

  async deleteDeck(id) {
    const msg = await decksApi.deleteDeck(id);
    console.log(msg);
  }

  async refreshList() {
    const decks = await decksApi.getAllDecks();
    this.setState( {allDecks: decks} );
  }

  componentDidMount() {
    this.refreshList();
  }

  render() {
    return (
      <div className='App'>
        <div id="create">
          <NewDeckForm />
          <DeckEntries handleRefresh={this.refreshList} 
                      decks={this.state.allDecks ? this.state.allDecks.map((deck) => { 
                        return <Deck key={deck.id} idNum={deck.id} data={deck} 
                        delete={this.deleteDeck} edit={this.editDeck} cancel={this.cancelEdit} /> 
                      })  : [] } />
        </div>
        <div id="edit">
          <DeckEditor currentDeck={this.state.currentDeck} cancel={this.cancelEdit} />
        </div>
      </div>
    );
  }
}