import React from 'react';
import Colors from './Colors';
import '../App.css';

export default class Deck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCards: this.props.data.cards.reduce((sum, card) => (sum + Number(card.qty)), 0)
        }
        this.editDeck = this.editDeck.bind(this);
        this.deleteDeck = this.deleteDeck.bind(this);
    }

    editDeck() {
        this.props.edit(this.props.idNum);
    }

    deleteDeck() {
        this.props.cancel();
        this.props.delete(this.props.idNum);
    }

    componentDidUpdate(prevprops, prevstate) {
        const { data } = this.props;
        let numCards = data.cards.reduce((sum, card) => (sum + Number(card.qty)), 0);
        if(prevstate.totalCards != numCards) {
            this.setState({totalCards: numCards});
            // console.log("updated state.totalCards");
        }
    }

    render() {
        return(
            <div className="cont">
                <h3>{this.props.data.id} — {this.props.data.name}</h3>
                <p>
                    <Colors colors={this.props.data.colors} />
                    {this.state.totalCards} cards ({this.props.data.cards.length} unique)
                </p>
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