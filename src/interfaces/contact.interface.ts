export interface IContact {
    _id: string;
    idSender: string;
    idReceptor: string;
    createdAt: Date;
    status: string;
}