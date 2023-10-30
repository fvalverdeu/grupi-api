export interface IMessage {
    _id?: string;
    idFrom: string;
    idTo: string;
    message: string;
    createdAt: Date;
}