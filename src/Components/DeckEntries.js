import React from 'react';

export default class DeckEntries extends React.Component {

    render() {
        return(
            <div>
                <br></br>
                <div>
                    <button onClick={this.props.handleRefresh}>&#10227;</button>
                </div>
                {this.props.decks}
            </div>
        );
    }     
}
