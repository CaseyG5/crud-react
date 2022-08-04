import React from 'react'
import { decksApi } from '../DecksAPI';
import '../App.css';
import { Deck } from '../Deck.mjs';
import CardList from './CardList';
import Tester from './Tester';

export default class DeckEditor extends React.Component {
    constructor(props) {
        super(props);

        this.tempDeck = null;   // full Deck object {id, name, cards, colors}  (received when 'Edit' is clicked)
        this.testDeck = [];     // array of 3-digit card id numbers   (used with the <Tester/> component)

        this.state = {
            deckID: '',                          // ID # of deck currently being edited
            deckName: '',                        // Name of deck "   "
            cards: [],                           // cards (names, id #s, and quantities) in deck being edited
            cardCount: 0,                                           // total # of cards "   "
            cbWhite: false, cbBlue: false, cbBlack: false,          // 6 checkboxes for colors
            cbRed: false, cbGreen: false, cbColorless: false,
            cardSearchText: '',                                     // for the card search input field
            cardName: '',                             // name of card returned from search
            cardID: 0,                                // and its ID #
            cardSrc: '',                              // the resulting path to the image
            my60: []                                  // full deck of card id #s  (copied from this.testDeck)
        }
                                       
        this.updateQuantity = this.updateQuantity.bind(this);                   
        this.removeCard = this.removeCard.bind(this);                                                                       
        this.getUpdatedColors = this.getUpdatedColors.bind(this);    
        this.buildTestDeck = this.buildTestDeck.bind(this);                                     
    }
                // for changing name of deck currently being edited
    handleDeckNameChange(evt) {  this.setState({deckName: evt.target.value});  }  
                
    handleCheckbox(evt) {                   // for checking & unchecking color checkboxes
        let color = evt.target.value;
        this.setState({ [`cb${color}`]: !this.state[`cb${color}`] });  
    }  
                // for the text in the card search input field
    handleCardNameChange(evt) {  this.setState({cardSearchText: evt.target.value});  }      

    async handleSearch() {                     // sends the api request for a card (searches by name or first few letters)
        if(!this.state.cardSearchText) return;
        const data = await decksApi.getCard(this.state.cardSearchText);
        if(data.cardName) this.setState({
            cardName: data.cardName, cardID: data.cardID, cardSrc: `/images/${data.cardID}.jpeg`
        });
        this.setState({cardSearchText: ''});
    }

    addCard() {                   // adds 1 copy of card currently being viewed to the deck currently being edited
        if(!this.state.deckName || !this.state.cardName) return;
        const wasAdded = this.tempDeck.addCard(this.state.cardName, this.state.cardID);
        if(wasAdded) this.setState({ cardCount: this.state.cardCount + 1 });
    }
    addFour() {                   // adds 4 copies of card "   " ...if space is available (4 max)
        if(!this.state.deckName || !this.state.cardName) return;
        const wasAdded = this.tempDeck.addCard(this.state.cardName, this.state.cardID, 4);
        if(wasAdded) this.setState({ cardCount: this.state.cardCount + 4 });
    }
    updateQuantity(id, qty) {     // updates quantity of card in list if quantity (number) input field was changed
        const difference = Number(this.tempDeck.updateCardQty(id, qty));
        this.setState({ cardCount: this.state.cardCount + Number(difference)});
    }
    removeCard(id) {              // removes all copies of a card from the deck currently being edited
        const numRemoved = this.tempDeck.removeCard(id);
        this.setState({ cardCount: this.state.cardCount - Number(numRemoved)});
    }
    removeAll() {                                       // removes all cards from the deck currently being edited
        if(!this.state.deckName) return;
        this.tempDeck.removeAllCards();
        this.setState({ cardCount: 0 });
    }

    buildTestDeck() {                       // populates this.testDeck with all cards in the deck (as card ID #s)
        this.testDeck.length = 0;
        this.tempDeck.cards.forEach((card) => {
            for(let i=0; i<card.qty; i++) {
                this.testDeck.push(card.id);
            }
        });
        this.setState({my60: this.testDeck});
    }

    cancelEdit() {                                 // resets relevant state variables, incl those for form fields
        this.setState({ 
            deckID: '', deckName: '', cards: [], cardCount: 0, 
            cbWhite: false, cbBlue: false, cbBlack: false, cbRed: false, cbGreen: false, cbColorless: false,
            my60: [] 
        });
        this.props.cancel();                    // resets current deck (prop variable) to null
    }

    getUpdatedColors() {                          // grabs the color(s) from currently selected color checkboxes
        const tempColors = [];
        if(this.state.cbWhite) tempColors.push("white");
        if(this.state.cbBlue) tempColors.push("blue");
        if(this.state.cbBlack) tempColors.push("black");
        if(this.state.cbRed) tempColors.push("red");
        if(this.state.cbGreen) tempColors.push("green");
        if(this.state.cbColorless) tempColors.push("colorless");
        return tempColors;
    }

    async handleSave() {                             // saves changes made during editing via PUT request to api
        if(!this.state.deckName) return;
        const deck = new Deck(this.state.deckName, this.state.deckID, this.getUpdatedColors());
        deck.cards = this.tempDeck.cards;
        deck.sortByName();
        await decksApi.updateDeck(deck);
        console.log("deck updated");
        this.cancelEdit();
    }

    componentDidUpdate(prevprops, prevstate) {
        const { currentDeck } = this.props;
        if(!prevprops.currentDeck && currentDeck) {      // if currentDeck WAS null but now contains data
            this.tempDeck = new Deck(currentDeck.name, currentDeck.id, currentDeck.colors);
            this.tempDeck.cards = currentDeck.cards.slice();  // must make a copy because props are read-only
                
            this.setState({                                  
                deckName: currentDeck.name,
                deckID: currentDeck.id,
                cards: this.tempDeck.cards,     // state.cards  POINTS TO  tempDeck.cards
                cardCount: currentDeck.cards.reduce((sum, card) => sum + Number(card.qty), 0),

                cbWhite: currentDeck.colors.includes("white"),
                cbBlue: currentDeck.colors.includes("blue"),
                cbBlack: currentDeck.colors.includes("black"),
                cbRed: currentDeck.colors.includes("red"),
                cbGreen: currentDeck.colors.includes("green"),
                cbColorless: currentDeck.colors.includes("colorless"),
            });
        }
        else if(prevprops.currentDeck && !currentDeck) {                     // else vice versa
            this.cancelEdit();
        }
    }

    render() {
      return (
        <div>
            <div className='flex-row'>
                <div id="editor-panel">
                    <div className='cont'>
                        <h2>{this.props.currentDeck ? `Editing "${this.props.currentDeck.name}"` : "Editor"}</h2>
                        <div className='flex-start' style={{marginLeft: "20px"}}>
                            <label>ID: &nbsp;
                                <input className='sm-input' type="text" value={this.props.currentDeck ? this.props.currentDeck.id : ''} readOnly/> &nbsp;&nbsp;
                            </label> &nbsp;
                            <label>Name: &nbsp;
                                <input style={{width: "180px"}} type="text" value={this.state.deckName} onChange={(evt) => this.handleDeckNameChange(evt)}/> 
                            </label>
                        </div>
                        <div style={{marginLeft: "20px"}}>
                            <br></br>
                            <div className='cbl-box'>
                                <label >
                                    <input type="checkbox" value="White" checked={this.state.cbWhite} onChange={(evt) => this.handleCheckbox(evt)}/>
                                &nbsp; White</label>
                                <label >
                                    <input type="checkbox" value="Blue" checked={this.state.cbBlue} onChange={(evt) => this.handleCheckbox(evt)}/> 
                                &nbsp; Blue</label>
                                <label >
                                    <input type="checkbox" value="Black" checked={this.state.cbBlack} onChange={(evt) => this.handleCheckbox(evt)}/> 
                                &nbsp; Black</label>
                            </div>
                            <div className='cbl-box'>
                                <label >
                                    <input type="checkbox" value="Red" checked={this.state.cbRed} onChange={(evt) => this.handleCheckbox(evt)}/> 
                                &nbsp; Red</label>
                                <label >
                                    <input type="checkbox" value="Green" checked={this.state.cbGreen} onChange={(evt) => this.handleCheckbox(evt)}/> 
                                &nbsp; Green</label>
                                <label >
                                    <input type="checkbox" value="Colorless" checked={this.state.cbColorless} onChange={(evt) => this.handleCheckbox(evt)}/> 
                                &nbsp; Colorless</label>
                            </div>    
                        </div>
                        <br></br>
                        <div id="card-n-ctrls">
                            <div id="card-frame">
                                <img src={`${this.state.cardSrc}`} width="223px" height="310px" alt=''/>
                            </div>
                            <div className='flex-col'>
                                <div>
                                    <button onClick={() => this.addCard()} className='btn btn-green'>+1</button><br></br><br></br>
                                    <button onClick={() => this.addFour()} className='btn btn-green'>+4</button><br></br><br></br>
                                    <button onClick={() => this.removeAll()} className='btn btn-red'>-all</button>
                                </div>
                                <div>
                                    <label>Total:</label><br></br>
                                    <input className='sm-input' type="number" value={this.state.cardCount} readOnly/>
                                </div>
                            </div>    
                        </div><br></br>
                        <div className='flex-start' style={{marginLeft: "20px"}}>
                            <input style={{width: "180px"}} type="text" value={this.state.cardSearchText} onChange={(evt) => this.handleCardNameChange(evt)} /> &nbsp;
                            <button onClick={() => this.handleSearch()} className='btn btn-blue'>&#128269;</button>
                        </div>
                        <br></br>
                        <div className='btn-block'>
                            <div className='btn-duo'>
                                <button onClick={() => this.cancelEdit()} className='btn btn-gray'>Cancel</button>
                                <button onClick={() => this.handleSave()} className='btn btn-blue'>Save</button>
                            </div>
                        </div>
                    </div>
                    { this.state.my60.length < 60 ? <p style={{marginLeft: "20px"}}>Load/create a deck of 60 &amp; click Test</p>
                                                  : null }
                </div>
                <div id="card-list" className='cont'>
                    {this.state.cards ? 
                        <CardList cards={this.state.cards} 
                                  has60={this.state.cardCount >= 60 ? true : false} 
                                  testMyDeck={this.buildTestDeck}
                                  updateQty={this.updateQuantity} 
                                  deleteCard={this.removeCard}/> 
                        : <p>No cards to display</p> }
                </div>
            </div>
            { this.state.my60.length >= 60 ? <Tester deck={this.testDeck} /> 
                                           : null }
        </div>
      );
    }
}