const { getErrorResult, getResult } = require( "../../base/baseController" );
const CardModel = require( "../../models/cardModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { USER, ERROR } = require( "../../utils/message" );

module.exports.addCard = async ( req, res ) =>
{
    try
    {
        const userId = req.user.id;
        const { cardNumber, expiryDate, CVV, country, zipCode, cardHolderName } = req.body;

        const card = await CardModel.findOne( { userId: userId } ).lean();

        if ( cardNumber === card?.cardNumber )
        {
            return getErrorResult( res, HttpStatusCode.Unauthorize, USER.card.alreadAxists );
        }

        const addCard = new CardModel( {
            userId: userId,
            cardNumber: cardNumber,
            expiryDate: expiryDate,
            CVV: CVV,
            country: country,
            zipCode: zipCode,
            cardHolderName: cardHolderName
        } );

        await addCard.save();

        return getResult( res, HttpStatusCode.Ok, addCard, USER.card.add );
    } catch ( error )
    {
        console.error( "Error in add card : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.getCardList = async ( req, res ) =>
{
    try
    {
        const userId = req.user.id;

        const cards = await CardModel.find( { userId: userId } ).lean();

        if ( cards.length === 0 )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, USER.card.notFound );
        }

        return getResult( res, HttpStatusCode.Ok, cards, USER.card.list );
    } catch ( error )
    {
        console.error( "Error in get card list : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.getCardById = async ( req, res ) =>
{
    try
    {
        const userId = req.user.id;
        const cardId = req.params.cardId;

        const card = await CardModel.findOne( { _id: cardId, userId: userId } ).lean();

        if ( !card )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, USER.card.notFound );
        }

        return getResult( res, HttpStatusCode.Ok, card, USER.card.get );
    } catch ( error )
    {
        console.error( "Error in get card : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.updateCard = async ( req, res ) =>
{
    try
    {
        const userId = req.user.id;
        const cardId = req.params.cardId;
        const { cardNumber, expiryDate, CVV, country, zipCode, cardHolderName, isDefault } = req.body;

        let validationCondition = { _id: { $ne: cardId } };

        const card = await CardModel.findOne( { _id: cardId, userId: userId } );

        if ( !card )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, USER.card.notFound );
        }

        if ( cardNumber )
        {
            validationCondition.cardNumber = cardNumber;
            const isCard = await CardModel.findOne( validationCondition );
            if ( isCard )
            {
                return getErrorResult( res, HttpStatusCode.Unauthorize, USER.card.alreadAxists );
            }
            card.cardNumber = cardNumber;
        }
        if ( expiryDate ) { card.expiryDate = expiryDate; }
        if ( CVV ) { card.CVV = CVV; }
        if ( country ) { card.country = country; }
        if ( zipCode ) { card.zipCode = zipCode; }
        if ( cardHolderName ) { card.cardHolderName = cardHolderName; }
        if ( isDefault !== undefined ) { card.isDefault = isDefault; }

        await card.save();

        // const updateCard = await CardModel.updateOne( { _id: cardId, userId: userId }, { $set: { updatedValue } } );

        return getResult( res, HttpStatusCode.Ok, card, USER.card.update );
    } catch ( error )
    {
        console.error( "Error in update card : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.deleteCard = async ( req, res ) =>
{
    try
    {
        const userId = req.user.id;
        const cardId = req.params.cardId;

        const card = await CardModel.findOne( { _id: cardId, userId: userId } ).lean();

        if ( !card )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, USER.card.notFound );
        }

        await CardModel.deleteOne( { _id: cardId, userId: userId } );

        return getResult( res, HttpStatusCode.Ok, 1, USER.card.delete );
    } catch ( error )
    {
        console.error( "Error in delete card : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};