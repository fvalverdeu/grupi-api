import { Request, Response } from "express";
import Contact from "../models/contact.model";
import { EContactStatus } from "../constants/contact.enum";

export const getContact = async (req: Request, res: Response): Promise<Response> => {
    try {
        const contact = await Contact.findOne({ _id: req.params.id });
        return res.status(200).json(contact);
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
        const newContact = new Contact(req.body);
        await newContact.save();
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
        const contacts = await Contact.find({ $or: [{ idSender: req.params.id, status: EContactStatus.ACCEPT }, { idReceptor: req.params.id, status: EContactStatus.ACCEPT }] });
        return res.status(200).json(contacts);
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const getRequestsRecived = async (req: Request, res: Response): Promise<Response> => {
    try {
        const contacts = await Contact.find({ $or: [{ idReceptor: req.params.id }] });
        return res.status(200).json(contacts);
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
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
}