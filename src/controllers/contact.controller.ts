import { Request, Response } from "express";
import Contact from "../models/contact.model";
import User from "../models/user.model";
import Place from "../models/place.model";
import Visit from "../models/visit.model";
import Notification from "../models/notification.model";
import { EContactStatus } from "../constants/contact.enum";
import { INotification } from "../interfaces/notification.interface";
import { ENotificationStatus } from "../constants/notification";

export const getContact = async (req: Request, res: Response): Promise<Response> => {
    try {
        const idContact = req.params.id;
        console.log(idContact);
        const idUser = req.body.id;
        console.log(idUser);
        if (!idUser) return res.status(500).json({ message: 'Debe proporcionar un id de usuario.' });
        const yourContactList: any[] = [];
        const yourPlaceList: any[] = [];
        let status: string = EContactStatus.NONE;
        let isSender: boolean = false;
        const user = await User.findOne({ _id: idUser });
        if (!user) return res.status(500).json({ message: 'El usuario no existe.' + idUser });
        const contactProfile = await User.findOne({ _id: idContact });
        if (!contactProfile) return res.status(500).json({ message: 'El contacto no existe.' });
        const contact = await Contact.findOne({
            $or: [{ idSender: idContact, idReceptor: idUser },
            { idSender: idUser, idReceptor: idContact }
            ]
        });
        console.log('contact ::::::::::::::: ', contact);
        if (contact) status = contact.status;
        if (contact) isSender = contact.idSender == req.params.id;
        if (contact?.status == EContactStatus.ACCEPT) {
            const sendList = await Contact.find({ idSender: idContact, status: EContactStatus.ACCEPT }).populate('idReceptor') as any[];
            const receptList = await Contact.find({ idReceptor: idContact, status: EContactStatus.ACCEPT }).populate('idSender') as any[];
            sendList.forEach(item => {
                const contactOfMyContact = {
                    id: item.idReceptor._id,
                    name: item.idReceptor.profile.name,
                }
                yourContactList.push(contactOfMyContact);
            });
            receptList.forEach(item => {
                const contactOfMyContact = {
                    id: item.idSender._id,
                    name: item.idSender.profile.name,
                }
                yourContactList.push(contactOfMyContact);
            });

            const places = await Visit.find({ idGrupi: idContact }).populate('idPlace') as any[];
            places.forEach(item => {
                const place = {
                    id: item.idPlace._id,
                    name: item.idPlace.name,
                    visitDate: item.visitStart,
                }
                yourPlaceList.push(place);
            })
        }
        const contactData = {
            id: contact ? contact.id : '',
            idContact: idContact,
            profile: contactProfile.profile,
            places: yourPlaceList,
            status: status,
            contacts: yourContactList,
            isSender: isSender,
        }
        return res.status(200).json(contactData);
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const getContacts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const contacts = await Contact.find();
        return res.status(200).json(contacts);
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const createContact = async (req: Request, res: Response): Promise<Response> => {
    try {
        let newIdContact = '';
        const newContact = new Contact(req.body);
        await newContact.save();
        const sender = await User.findOne({ _id: req.body.idSender });
        const objNotification: INotification = {
            idGrupi: newContact.idReceptor,
            title: `${sender?.profile.name} te ha enviado una solicitud`,
            description: `Para aceptar o rechazar ingresa a "Mi Red".`,
            createdAt: new Date(),
            status: ENotificationStatus.ACTIVE
        };
        const newNotification = new Notification(objNotification);
        await newNotification.save();
        return res.status(200).json({ data: newContact });
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const updateContact = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const contact = req.body;
        const contactUpdated = await Contact.findOneAndUpdate({ _id: id }, contact, { new: true });
        if (contactUpdated) return res.status(200).json(contact);
        else return res.status(200).json({ message: 'No se encuentra el elemento.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}

export const deleteContact = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { contactname } = req.params;
        await Contact.findOneAndDelete({ contactname });
        return res.status(200).json({ response: 'Contact deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}

export const getContactsOfUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const yourContactList: any[] = [];
        const idUser = req.params.id;
        if (!idUser) return res.status(500).json({ message: 'Ingrese un ID Grupi' });
        // const contacts = await Contact.find({ $or: [{ idSender: req.params.id, status: EContactStatus.ACCEPT }, { idReceptor: req.params.id, status: EContactStatus.ACCEPT }] });
        const sendList = await Contact.find({ idSender: idUser, status: EContactStatus.ACCEPT }).populate('idReceptor') as any[];
        console.log('SEND LIST', sendList);
        const receptList = await Contact.find({ idReceptor: idUser, status: EContactStatus.ACCEPT }).populate('idSender') as any[];
        console.log('RECEPT LIST', receptList);
        sendList.forEach(item => {
            const contact = {
                id: item.id,
                idContact: item.idReceptor._id,
                name: item.idReceptor.profile.name,
                date: item.createdAt,
                urlImage: item.idReceptor.profile.imageUrl,
                description: 'Disponible',
            }
            yourContactList.push(contact);
        });
        receptList.forEach(item => {
            const contact = {
                id: item.id,
                idContact: item.idSender._id,
                name: item.idSender.profile.name,
                date: item.createdAt,
                urlImage: item.idSender.profile.imageUrl,
                description: 'Disponible',
            }
            yourContactList.push(contact);
        });
        return res.status(200).json(yourContactList);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const getRequestsRecived = async (req: Request, res: Response): Promise<Response> => {
    try {
        const yourContactList: any[] = [];
        const idUser = req.params.id;
        if (!idUser) return res.status(500).json({ message: 'Ingrese un ID Grupi' });
        const receptList = await Contact.find({ idReceptor: idUser, status: EContactStatus.SEND }).populate('idSender') as any[];
        console.log(receptList);
        receptList.forEach(item => {
            const contact = {
                id: item.id,
                idContact: item.idSender._id,
                name: item.idSender.profile.name,
                date: item.createdAt,
                urlImage: item.idSender.profile.imageUrl,
                description: 'Disponible',
            }
            yourContactList.push(contact);
        });
        return res.status(200).json(yourContactList);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const acceptRequestsRecived = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;

        if (!id) return res.status(500).json({ message: 'Debe enviar el id de la solicitud como parámetro.' });
        const contact = await Contact.findOne({ _id: id });
        if (!contact) {
            return res.status(400).json({ msg: 'La solicitud no existe' });
        }
        const contactUpdated = await Contact.findOneAndUpdate({ _id: id }, { status: EContactStatus.ACCEPT }, { new: true });
        const receptor = await User.findOne({ _id: contact.idReceptor });
        const objNotification: INotification = {
            idGrupi: contact.idSender,
            title: `${receptor?.profile.name} ha aceptado tu solicitud`,
            description: `Ahora pueden ver sus perfiles e iniciar una conversación por chat.`,
            createdAt: new Date(),
            status: ENotificationStatus.ACTIVE
        };
        const newNotification = new Notification(objNotification);
        await newNotification.save();
        return res.status(200).json({ confirm: true });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error al aceptar solicitud' });
    }
}

export const declineRequestsRecived = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;

        if (!id) return res.status(500).json({ message: 'Debe enviar el id de la solicitud como parámetro.' });
        const contact = await Contact.findOne({ _id: id });
        if (!contact) {
            return res.status(400).json({ msg: 'La solicitud no existe' });
        }
        await Contact.findOneAndUpdate({ id: id }, { status: EContactStatus.DECLINE }, { new: true });
        const receptor = await User.findOne({ _id: contact.idReceptor });
        const objNotification: INotification = {
            idGrupi: contact.idSender,
            title: `${receptor?.profile.name} ha rechazado tu solicitud`,
            description: `Ahora pueden ver sus perfiles e iniciar una conversación por chat.`,
            createdAt: new Date(),
            status: ENotificationStatus.ACTIVE
        };
        const newNotification = new Notification(objNotification);
        await newNotification.save();
        return res.status(200).json({ confirm: true });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error al rechazar la solicitud' });
    }
}


export default {
    getContact,
    getContacts,
    createContact,
    updateContact,
    deleteContact,
    getContactsOfUser,
    getRequestsRecived,
    acceptRequestsRecived,
    declineRequestsRecived
}