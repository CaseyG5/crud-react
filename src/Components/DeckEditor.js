import React from 'react'
import { decksApi } from '../DecksAPI';
import '../App.css';
import { Deck } from '../Deck.mjs';
import CardList from './CardList';
import Tester from './Tester';

export default class DeckEditor extends React.Component {
    constructor(props) {
        super(props);

        this.tempDeck = null;   // full Deck object {id, name, cards, colors}
        this.testDeck = [];     // array of 3-digit card id numbers

        this.state = {
            deckID: '',         
            deckName: '',
            cards: [],
            cardCount: 0,
            cbWhite: false, cbBlue: false, cbBlack: false,
            cbRed: false, cbGreen: false, cbColorless: false,
            cardSearchText: '',
            cardName: '',
            cardID: 0,
            cardSrc: '',
            my60: []
        }
        this.handleDeckNameChange = this.handleDeckNameChange.bind(this);
        this.handleCheckboxWhite = this.handleCheckboxWhite.bind(this);
        this.handleCheckboxBlue = this.handleCheckboxBlue.bind(this);
        this.handleCheckboxBlack = this.handleCheckboxBlack.bind(this);
        this.handleCheckboxRed = this.handleCheckboxRed.bind(this);
        this.handleCheckboxGreen = this.handleCheckboxGreen.bind(this);
        this.handleCheckboxColorless = this.handleCheckboxColorless.bind(this);
        this.handleCardNameChange = this.handleCardNameChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.addCard = this.addCard.bind(this);
        this.addFour = this.addFour.bind(this);
        this.updateQuantity = this.updateQuantity.bind(this);
        this.removeCard = this.removeCard.bind(this);
        this.removeAll = this.removeAll.bind(this);
        this.buildTestDeck = this.buildTestDeck.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.getUpdatedColors = this.getUpdatedColors.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleDeckNameChange(evt) {  this.setState({deckName: evt.target.value});  }

    handleCheckboxWhite() {  this.setState({cbWhite: !this.state.cbWhite});  }
    handleCheckboxBlue() {  this.setState({cbBlue: !this.state.cbBlue});  }
    handleCheckboxBlack() {  this.setState({cbBlack: !this.state.cbBlack});  }
    handleCheckboxRed() {  this.setState({cbRed: !this.state.cbRed});  }
    handleCheckboxGreen() {  this.setState({cbGreen: !this.state.cbGreen});  }
    handleCheckboxColorless() {  this.setState({cbColorless: !this.state.cbColorless});  }

    handleCardNameChange(evt) {  this.setState({cardSearchText: evt.target.value});  }

    async handleSearch() {
        if(!this.state.cardSearchText) return;
        const data = await decksApi.getCard(this.state.cardSearchText);
        if(data.cardName) this.setState({
            cardName: data.cardName, cardID: data.cardID, cardSrc: `/images/${data.cardID}.jpeg`
        });
        this.setState({cardSearchText: ''});
    }

    addCard() {
        if(!this.state.deckName || !this.state.cardName) return;
        const wasAdded = this.tempDeck.addCard(this.state.cardName, this.state.cardID);
        if(wasAdded) this.setState({ cardCount: this.state.cardCount + 1 });
    }
    addFour() {
        if(!this.state.deckName || !this.state.cardName) return;
        const wasAdded = this.tempDeck.addCard(this.state.cardName, this.state.cardID, 4);
        if(wasAdded) this.setState({ cardCount: this.state.cardCount + 4 });
    }
    updateQuantity(id, qty) {
        // if(!this.state.deckName) return;
        const difference = Number(this.tempDeck.updateCardQty(id, qty));
        
        this.setState({ cardCount: this.state.cardCount + Number(difference)});
    }
    removeCard(id) {
        const numRemoved = this.tempDeck.removeCard(id);
        this.setState({ cardCount: this.state.cardCount - Number(numRemoved)});
    }
    removeAll() {
        if(!this.state.deckName) return;
        this.tempDeck.removeAllCards();
        this.setState({ cardCount: 0 });
    }

    buildTestDeck() {
        this.testDeck.length = 0;
        console.log("building test deck");
        this.tempDeck.cards.forEach((card) => {
            for(let i=0; i<card.qty; i++) {
                this.testDeck.push(card.id);
            }
        });
        this.setState({my60: this.testDeck});
          
    }

    cancelEdit() {
        this.setState({ 
            deckID: '', deckName: '', cards: [], cardCount: 0, 
            cbWhite: false, cbBlue: false, cbBlack: false, cbRed: false, cbGreen: false, cbColorless: false,
            my60: [] 
        });
        this.props.cancel();
    }

    getUpdatedColors() {        // update deck.colors 
        const tempColors = [];
        if(this.state.cbWhite) tempColors.push("white");
        if(this.state.cbBlue) tempColors.push("blue");
        if(this.state.cbBlack) tempColors.push("black");
        if(this.state.cbRed) tempColors.push("red");
        if(this.state.cbGreen) tempColors.push("green");
        if(this.state.cbColorless) tempColors.push("colorless");
        return tempColors;
    }

    async handleSave() {
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
                <div id="editor-panel" className='cont'>
                    <h2>{this.props.currentDeck ? `Editing "${this.props.currentDeck.name}"` : "Editor"}</h2>
                    <div className='flex-start' style={{marginLeft: "20px"}}>
                        <label>ID: &nbsp;
                            <input className='sm-input' type="text" value={this.props.currentDeck ? this.props.currentDeck.id : ''} readOnly/> &nbsp;&nbsp;
                        </label> &nbsp;
                        <label>Name: &nbsp;
                            <input style={{width: "180px"}} type="text" value={this.state.deckName} onChange={this.handleDeckNameChange}/> 
                        </label>
                    </div>
                    <div style={{marginLeft: "20px"}}>
                        <br></br>
                        <div className='cbl-box'>
                            <label >
                                <input type="checkbox" value="white" checked={this.state.cbWhite} onChange={this.handleCheckboxWhite}/>
                            &nbsp; White</label>
                            <label >
                                <input type="checkbox" value="blue" checked={this.state.cbBlue} onChange={this.handleCheckboxBlue}/> 
                            &nbsp; Blue</label>
                            <label >
                                <input type="checkbox" value="black" checked={this.state.cbBlack} onChange={this.handleCheckboxBlack}/> 
                            &nbsp; Black</label>
                        </div>
                        <div className='cbl-box'>
                            <label >
                                <input type="checkbox" value="red" checked={this.state.cbRed} onChange={this.handleCheckboxRed}/> 
                            &nbsp; Red</label>
                            <label >
                                <input type="checkbox" value="green" checked={this.state.cbGreen} onChange={this.handleCheckboxGreen}/> 
                            &nbsp; Green</label>
                            <label >
                                <input type="checkbox" value="colorless" checked={this.state.cbColorless} onChange={this.handleCheckboxColorless}/> 
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
                                <button onClick={this.addCard} className='btn btn-green'>+1</button><br></br><br></br>
                                <button onClick={this.addFour} className='btn btn-green'>+4</button><br></br><br></br>
                                <button onClick={this.removeAll} className='btn btn-red'>-all</button>
                            </div>
                            <div>
                                <label>Total:</label><br></br>
                                <input className='sm-input' type="number" value={this.state.cardCount} readOnly/>
                            </div>
                        </div>    
                    </div><br></br>
                    <div className='flex-start' style={{marginLeft: "20px"}}>
                        <input style={{width: "180px"}} type="text" value={this.state.cardSearchText} onChange={this.handleCardNameChange} /> &nbsp;
                        <button onClick={this.handleSearch} className='btn btn-blue'>&#128269;</button>
                    </div>
                    <br></br>
                    <div className='btn-block'>
                        <div className='btn-duo'>
                            <button onClick={this.cancelEdit} className='btn btn-gray'>Cancel</button>
                            <button onClick={this.handleSave} className='btn btn-blue'>Save</button>
                        </div>
                    </div>
                </div>
                <div id="card-list" className='cont'>
                    {this.state.cards ? <CardList cards={this.state.cards} has60={this.state.cardCount >= 60 ? true : false} 
                                                  testMyDeck={this.buildTestDeck}
                                                  updateQty={this.updateQuantity} deleteCard={this.removeCard}/> 
                        : <p>No cards to display</p> }
                </div>
            </div>
            { this.state.my60.length >= 60 ? <Tester deck={this.testDeck} /> 
                                           : <p style={{marginLeft: "20px"}}>Load/create a deck of 60 cards and click Test</p> }
        </div>
      );
    }
}