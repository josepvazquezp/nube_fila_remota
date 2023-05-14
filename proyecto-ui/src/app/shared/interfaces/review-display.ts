export interface ReviewDisplay {
    name: String,
    email: String,
    image: String,
    description: String,
    rating: number,
    total: number,
    products: {
        Name: String,
        Image: String,
        Price: number,
        Quantity: number
    }[]
}
