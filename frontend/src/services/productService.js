const API_URL =import.meta.env.VITE_API_URL;

export const getProducts = async () => {
    const response = await fetch(`${API_URL}/products`)

    if(!response.ok){
        throw new Error("Failed to fetch products")
    }

    return response.json();
}