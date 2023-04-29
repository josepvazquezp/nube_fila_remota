export interface User {
    _id: String,
    email: String,
    password:String,
    name: String,
    type:String,
    history: Array<Object>,
    status: String,
    image:  String
    restaurant: String;

}