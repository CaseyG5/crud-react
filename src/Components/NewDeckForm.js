import React from 'react';
import { decksApi } from '../DecksAPI';
import '../App.css';

export default class NewDeckForm extends React.Component {
    constructor() {
        super();
        this.state = {
            deckName: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }

    handleChange(evt) {
        this.setState({deckName: evt.target.value});
    }

    async handleAdd(evt) {
        evt.preventDefault();
        const deck = await decksApi.createDeck(this.state.deckName);
        // console.log("deck:", deck);
        this.setState({deckName: ''});
    }

    render() {
        return(
            <form className='cont'>
                <h2>Create New Deck</h2>
                <div className='flex-start'>
                    <input className='' type="text" value={this.state.deckName} 
                           onChange={this.handleChange} /> &nbsp;
                    <button onClick={this.handleAdd} className='btn btn-green'>Add</button>
                </div>    
            </form>
        );
    }
}