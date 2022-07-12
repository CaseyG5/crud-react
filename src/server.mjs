import Deck from './Deck.mjs';
import {cards} from '../../../crud-app/cards.js';
const simplerCards = cards.map( card => {
    const {multiverseid, name, manaCost, type, text} = card;
    return {id: multiverseid, name, cost: manaCost, type, text};  // name: name, not necessary due to nifty shorthand
});

const PORT = 3001;
import express from '../../../crud-app/node_modules/express/index.js';
const app = express();
import http from 'http';
const server = http.createServer(app);

let decks = [];
let deckID = 1;
decks.push(new Deck("Yin & Yang", deckID++, ["black", "white"]));   // start with 1 entry


app.use( express.static('../build') );      // Access to public folder containing HTML, CSS, JS

// app.use( '/node_modules', express.static('../node_modules') );   // Access to Bootstrap & jQuery

app.use(express.json());                    // important!  needed to see req.body

app.use('/images', express.static('../../../draft-2ed/public/images',) );  // Access to the images

// GET a card matching given name or first few letters
app.get('/api/cards/:name', (req, resp) => {
    // console.log(req.params);
    const singleCard = simplerCards.find( card => card.name.toLowerCase().startsWith(req.params.name.toLowerCase()) );
    if(!singleCard) {
        return resp.json( {success: false, msg: "No matches found"} );
    }
    resp.status(200).json( {success: true, cardName: `${singleCard.name}`, cardID: singleCard.id} );
});

// Get all decks
app.get('/api/decks', (req, resp) => {
    if(decks.length == 0) return resp.status(204).json( { success: true, msg: "No decks to retrieve"})  // Status code for "no content"
    resp.status(200).json( decks );
});

// GET a deck matching given ID
app.get('/api/decks/:id', (req, resp) => {
    const singleDeck = decks.find( (deck) => deck.id == req.params.id);
    if(!singleDeck) {
        return resp.end("No decks found with that particular ID.");
    }
    resp.status(200).json( {success: true, deck: singleDeck} );
});

// POST/ADD a deck
app.post('/api/decks', (req, resp) => {
    console.log(req.body);
    const { name } = req.body;   // pull or "destructure" properties from req.body
    if(!name) return resp.status(400).json( {success: false, msg: "Please supply a name for the deck"} );
    const deckToAdd = new Deck(name, deckID++);
    decks.push( deckToAdd );
    resp.status(201).json( {success: true, deck: deckToAdd} );                 // Status code for "created"
});

// PUT/UPDATE a deck
app.put('/api/decks/:id', (req, resp) => {
    const {name, cards, colors } = req.body;
    const deckToUpdate = decks.find( (deck) => deck.id == req.params.id);
    if(!deckToUpdate) return resp.status(404).json( {success: false, msg: "No decks found matching that ID."} );
    if(name) deckToUpdate.name = name;
    if(cards) deckToUpdate.cards = cards;
    if(colors) deckToUpdate.colors = colors;
    resp.status(200).json( {success: true, deck: deckToUpdate} );             
});

// DELETE a deck
app.delete('/api/decks/:id', (req, resp) => {
    const deckToDelete = decks.find( (deck) => deck.id == req.params.id );
    if(!deckToDelete) return resp.status(404).json( {success: false, msg: "No decks found matching that ID."} );
    let index = decks.indexOf(deckToDelete, 0);             // can we avoid searching twice?
    decks.splice(index, 1);
    resp.status(200).json( {success: true, msg: "Delete successful"} ); 
});

app.all('*', (req, resp) => {                           // All others not found
    resp.status(404).send(`<h1>Hmmm...</h1>
<p>We can't seem to find that resource.</p>
<a href='/'>Home</a>`);
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});