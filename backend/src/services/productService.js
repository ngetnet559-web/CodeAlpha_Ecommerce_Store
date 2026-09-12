import prisma from "../lib/prisma.js";

export const getAllProducts = async ()=> {
    return await prisma.product.findMany()
}

export const getProduct = async (productId) => {
    return await prisma.product.findUnique({
        where: {
            product_id: productId,
        }
    })
}

export const createProduct = async(productData) => {
    return await prisma.product.create({
        data: productData,
    })
}

export const updateProduct = async(productId, productData) => {
    return await prisma.product.update({
        where: {
            product_id: productId
        },
        data:productData
    })
}

export const deleteProduct = async(productId) => {
    return await prisma.product.delete({
        where:{
            product_id: productId
        }
    })
}