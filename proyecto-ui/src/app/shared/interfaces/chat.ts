import { Message } from "./message"

export interface Chat {
        _id: String,
        customerId: String,
        restaurantId: String,
        messages: Message[]
}
