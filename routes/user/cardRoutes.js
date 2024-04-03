const express = require( 'express' );
const { addCard, getCardList, getCardById, updateCard, deleteCard } = require( '../../controller/user/cardController' );
const cardRouter = express.Router();

cardRouter.post( '/addCard', addCard );

cardRouter.get( '/getCardList', getCardList );

cardRouter.get( '/getCard/:cardId', getCardById );

cardRouter.put( '/updateCard/:cardId', updateCard );

cardRouter.delete( '/deleteCard/:cardId', deleteCard );

module.exports = cardRouter;