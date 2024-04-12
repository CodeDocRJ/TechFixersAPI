const { getResult, getErrorResult } = require( "../../base/baseController" );
const ProductCategoryModel = require( "../../models/productCategoryModel" );
const ProductModel = require( "../../models/productModel" );
const UserModel = require( "../../models/userModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ADMIN, ERROR } = require( "../../utils/message" );

const cloudinary = require( 'cloudinary' ).v2;

module.exports.addNewProduct = async ( req, res ) =>
{
    try
    {
        const { categoryId, name, type, brand, model, price, description, rating } = req.body;

        let createdValue = {};

        const productCat = await ProductCategoryModel.findOne( { _id: categoryId } );

        if ( !productCat )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.product_category.notFound );
        }

        const result = await cloudinary.uploader.upload( req.file.path, { folder: 'Products' } );

        if ( rating && rating.rate )
        {
            createdValue.rating = {
                ...createdValue.rating,
                rate: rating.rate
            };
        }
        if ( rating && rating.count )
        {
            createdValue.rating = {
                ...createdValue.rating,
                count: rating.count
            };
        }

        const newProduct = new ProductModel( {
            categoryId,
            name,
            type,
            brand,
            model,
            price,
            description,
            productImage: result.secure_url, // Save Cloudinary image URL
            ...createdValue
        } );
        await newProduct.save();

        return getResult( res, HttpStatusCode.Ok, newProduct, ADMIN.product.add );
    } catch ( error )
    {
        console.error( "Error in add new product : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.getProductList = async ( req, res ) =>
{
    try
    {
        const products = await ProductModel.find();

        if ( products.length === 0 )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.product.notFound );
        }

        return getResult( res, HttpStatusCode.Ok, products, ADMIN.product.list );
    } catch ( error )
    {
        console.error( "Error in get product list : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.updateProduct = async ( req, res ) =>
{
    try
    {
        const productId = req.params.productId;
        const { categoryId, name, type, brand, model, price, description, rating } = req.body;
        const productImage = req.file;

        const product = await ProductModel.findById( productId );

        if ( !product )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.product.notFound );
        }

        if ( categoryId )
        {
            const productCat = await ProductCategoryModel.findById( categoryId );

            if ( !productCat )
            {
                return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.product_category.notFound );
            }

            product.categoryId = categoryId;
        }
        product.name = name ? name : product.name;
        product.type = type ? type : product.type;
        product.brand = brand ? brand : product.brand;
        product.model = model ? model : product.model;
        product.price = price ? price : product.price;
        product.description = description ? description : product.description;
        if ( productImage )
        {
            const result = await cloudinary.uploader.upload( req.file.path, { folder: 'Products' } );
            product.productImage = result.secure_url || product.productImage;
        }
        if ( rating && rating.rate )
        {
            product.rating = {
                ...product.rating,
                rate: rating.rate
            };
        }
        if ( rating && rating.count )
        {
            product.rating = {
                ...product.rating,
                count: rating.count
            };
        }

        await product.save();

        return getResult( res, HttpStatusCode.Ok, product, ADMIN.product.update );
    } catch ( error )
    {
        console.error( "Error in update product : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.deleteProduct = async ( req, res ) =>
{
    try
    {
        const { productId } = req.params;

        const product = await ProductModel.findById( productId );

        if ( !product )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.product.notFound );
        }

        // await repairCategory.deleteOne();
        await product.deleteOne( { _id: productId } );

        return getResult( res, HttpStatusCode.Ok, 1, ADMIN.product.delete );
    } catch ( error )
    {
        console.error( "Error in delete product : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};