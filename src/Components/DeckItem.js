import React from 'react';
import Colors from './Colors';
import '../App.css';

export default class Deck extends React.Component {
    constructor(props) {
        super(props);
        this.editDeck = this.editDeck.bind(this);
        this.deleteDeck = this.deleteDeck.bind(this);
    }

    editDeck() {
        this.props.edit(this.props.idNum);
    }

    deleteDeck() {
        this.props.delete(this.props.idNum);
    }

    render() {
        return(
            <div className="cont">
                <h3>{this.props.data.id} — {this.props.data.name}</h3>
                <p>{this.props.data.cards.length} cards — <Colors colors={this.props.data.colors} /></p>
                <div className='btn-block'>
                    <div className="btn-duo">
                        <button  onClick={this.deleteDeck} className='btn btn-red'>Delete</button>&nbsp;
                        <button  onClick={this.editDeck} className='btn btn-blue'>Edit</button>
                    </div>
                </div>    
            </div>
        );
    }  
}

// className="btn btn-danger action-btn"