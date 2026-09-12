import prisma from "../lib/prisma.js";

export const getAllProducts = async ()=> {
    return await prisma.product.findMany()
}

export const createProduct = async(productData) => {
    return await prisma.product.create({
        data: productData,
    })
}