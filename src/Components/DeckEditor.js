import React from 'react'
import { decksApi } from '../DecksAPI';
import '../App.css';
import Deck from '../Deck.mjs';
import CardList from './CardList';

export default class DeckEditor extends React.Component {
    constructor(props) {
        super(props);

        this.tempDeck = null;
        this.qty = 1;

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
            cardSrc: ''
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
        this.removeOne = this.removeOne.bind(this);
        this.removeAll = this.removeAll.bind(this);
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
        const data = await decksApi.getCard(this.state.cardSearchText);
        if(data.cardName) this.setState({
            cardName: data.cardName, cardID: data.cardID, cardSrc: `/images/${data.cardID}.jpeg`
        });
        this.setState({cardSearchText: ''});
    }

    addCard() {
        if(!this.tempDeck || !this.state.cardName) {
            // notify user that deck and card must be loaded first
            return;
        }
        this.tempDeck.addCard(this.state.cardName, this.state.cardID);
        this.setState({ cardCount: this.state.cardCount + 1});
        console.log(this.state.cardName, "added to currentDeck");
    }
    addFour() {
        if(!this.state.deckName || !this.state.cardName) return;
        this.tempDeck.addCard(this.state.cardName, this.state.cardID, 4);
        this.setState({ cardCount: this.state.cardCount + 4});
        console.log(this.state.cardName, "added 4x to currentDeck");
    }
    removeOne() {
        if(!this.state.deckName || !this.state.cardName) return;
        this.tempDeck.removeCard(this.state.cardID);
        if(this.state.cardCount > 0) this.setState({ cardCount: this.state.cardCount - 1});
        console.log(this.state.cardName, "removed from currentDeck");
    }
    removeAll() {
        if(!this.state.deckName || !this.state.cardName) return;
        this.tempDeck.removeAllCards();
        this.setState({ cardCount: 0});
        console.log("all cards removed from currentDeck");
    }

    cancelEdit() {
        this.setState({ 
            deckID: '', deckName: '', cards: [], cardCount: 0, 
            cbWhite: false, cbBlue: false, cbBlack: false, cbRed: false, cbGreen: false, cbColorless: false 
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
        const updated = await decksApi.updateDeck(deck);
        console.log("deck updated:", updated);
        this.cancelEdit();
    }

    componentDidUpdate(prevprops, prevstate) {
        const { currentDeck } = this.props;
        if(!prevprops.currentDeck && currentDeck) {      // if currentDeck WAS null but now contains data
            this.tempDeck = new Deck(currentDeck.name, currentDeck.id, currentDeck.colors);
            this.tempDeck.cards = currentDeck.cards.slice();
                
            this.setState({                                  
                deckName: currentDeck.name,
                deckID: currentDeck.id,
                cards: this.tempDeck.cards,
                cardCount: currentDeck.cards.length,

                cbWhite: currentDeck.colors.includes("white"),
                cbBlue: currentDeck.colors.includes("blue"),
                cbBlack: currentDeck.colors.includes("black"),
                cbRed: currentDeck.colors.includes("red"),
                cbGreen: currentDeck.colors.includes("green"),
                cbColorless: currentDeck.colors.includes("colorless"),
            });
            
        }
    }

    render() {
        return (
            <div className='flex-row'>
                <div id="editor-panel" className='cont'>
                    <h2>{this.props.currentDeck ? `Editing "${this.props.currentDeck.name}"` : "Editor"}</h2>
                    <div className='flex-start'>
                        <label>ID: &nbsp;</label>
                        <input className='ro-input' type="text" value={this.props.currentDeck ? this.props.currentDeck.id : ''} readOnly/> &nbsp;&nbsp;
                        <label>Name: &nbsp;</label>
                        <input  type="text" value={this.state.deckName} onChange={this.handleDeckNameChange}/> 
                    </div>
                    <div style={{marginLeft: "20px"}}>
                        <br></br>
                        <input type="checkbox" value="white" checked={this.state.cbWhite} onChange={this.handleCheckboxWhite}/> <label>White</label>
                        <input type="checkbox" value="blue" checked={this.state.cbBlue} onChange={this.handleCheckboxBlue}/> <label>Blue</label>
                        <input type="checkbox" value="black" checked={this.state.cbBlack} onChange={this.handleCheckboxBlack}/> <label>Black</label><br></br>
                        <input type="checkbox" value="red" checked={this.state.cbRed} onChange={this.handleCheckboxRed}/> <label>Red</label>
                        <input type="checkbox" value="green" checked={this.state.cbGreen} onChange={this.handleCheckboxGreen}/> <label>Green</label>
                        <input type="checkbox" value="colorless" checked={this.state.cbColorless} onChange={this.handleCheckboxColorless}/> <label>Colorless</label>
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
                                <button onClick={this.removeOne} className='btn btn-red'>-1</button><br></br><br></br>
                                <button onClick={this.removeAll} className='btn btn-red'>-all</button>
                            </div>
                            <div>
                                <input className='ro-input' type="number" value={this.state.cardCount} readOnly/>
                            </div>
                        </div>    
                    </div><br></br>
                    <div className='flex-start'>
                        <input className='w-200' type="text" value={this.state.cardSearchText} onChange={this.handleCardNameChange} /> &nbsp;
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
                    {this.state.cards ? <CardList cards={this.state.cards.filter((card, index, array) => {
                        if(index+1 < array.length) return (card.id !== array[index+1].id);
                        else return true; } )} /> 
                        : <p>No cards to display</p> }
                </div>
            </div>
        );
    }
}
    