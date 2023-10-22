"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.declineRequestsRecived = exports.acceptRequestsRecived = exports.getRequestsRecived = exports.getContactsOfUser = exports.deleteContact = exports.updateContact = exports.createContact = exports.getContacts = exports.getContact = void 0;
const contact_model_1 = __importDefault(require("../models/contact.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const visit_model_1 = __importDefault(require("../models/visit.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const contact_enum_1 = require("../constants/contact.enum");
const notification_1 = require("../constants/notification");
const getContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idContact = req.params.id;
        console.log(idContact);
        const idUser = req.body.id;
        console.log(idUser);
        if (!idUser)
            return res.status(500).json({ message: 'Debe proporcionar un id de usuario.' });
        const yourContactList = [];
        const yourPlaceList = [];
        let status = contact_enum_1.EContactStatus.NONE;
        let isSender = false;
        const user = yield user_model_1.default.findOne({ _id: idUser });
        if (!user)
            return res.status(500).json({ message: 'El usuario no existe.' + idUser });
        const contactProfile = yield user_model_1.default.findOne({ _id: idContact });
        if (!contactProfile)
            return res.status(500).json({ message: 'El contacto no existe.' });
        const contact = yield contact_model_1.default.findOne({
            $or: [{ idSender: idContact, idReceptor: idUser },
                { idSender: idUser, idReceptor: idContact }
            ]
        });
        console.log('contact ::::::::::::::: ', contact);
        if (contact)
            status = contact.status;
        if (contact)
            isSender = contact.idSender == req.params.id;
        if ((contact === null || contact === void 0 ? void 0 : contact.status) == contact_enum_1.EContactStatus.ACCEPT) {
            const sendList = yield contact_model_1.default.find({ idSender: idContact, status: contact_enum_1.EContactStatus.ACCEPT }).populate('idReceptor');
            const receptList = yield contact_model_1.default.find({ idReceptor: idContact, status: contact_enum_1.EContactStatus.ACCEPT }).populate('idSender');
            sendList.forEach(item => {
                const contactOfMyContact = {
                    id: item.idReceptor._id,
                    name: item.idReceptor.profile.name,
                };
                yourContactList.push(contactOfMyContact);
            });
            receptList.forEach(item => {
                const contactOfMyContact = {
                    id: item.idSender._id,
                    name: item.idSender.profile.name,
                };
                yourContactList.push(contactOfMyContact);
            });
            const places = yield visit_model_1.default.find({ idGrupi: idContact }).populate('idPlace');
            places.forEach(item => {
                const place = {
                    id: item.idPlace._id,
                    name: item.idPlace.name,
                    visitDate: item.visitStart,
                };
                yourPlaceList.push(place);
            });
        }
        const contactData = {
            id: contact ? contact.id : '',
            idContact: idContact,
            profile: contactProfile.profile,
            places: yourPlaceList,
            status: status,
            contacts: yourContactList,
            isSender: isSender,
        };
        return res.status(200).json(contactData);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getContact = getContact;
const getContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield contact_model_1.default.find();
        return res.status(200).json(contacts);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getContacts = getContacts;
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newIdContact = '';
        const newContact = new contact_model_1.default(req.body);
        yield newContact.save();
        const sender = yield user_model_1.default.findOne({ _id: req.body.idSender });
        const objNotification = {
            idGrupi: newContact.idReceptor,
            title: `${sender === null || sender === void 0 ? void 0 : sender.profile.name} te ha enviado una solicitud`,
            description: `Para aceptar o rechazar ingresa a "Mi Red".`,
            createdAt: new Date(),
            status: notification_1.ENotificationStatus.ACTIVE
        };
        const newNotification = new notification_model_1.default(objNotification);
        yield newNotification.save();
        return res.status(200).json({ data: newContact });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.createContact = createContact;
const updateContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const contact = req.body;
        const contactUpdated = yield contact_model_1.default.findOneAndUpdate({ _id: id }, contact, { new: true });
        if (contactUpdated)
            return res.status(200).json(contact);
        else
            return res.status(200).json({ message: 'No se encuentra el elemento.' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.updateContact = updateContact;
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contactname } = req.params;
        yield contact_model_1.default.findOneAndDelete({ contactname });
        return res.status(200).json({ response: 'Contact deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.deleteContact = deleteContact;
const getContactsOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yourContactList = [];
        const idUser = req.params.id;
        if (!idUser)
            return res.status(500).json({ message: 'Ingrese un ID Grupi' });
        // const contacts = await Contact.find({ $or: [{ idSender: req.params.id, status: EContactStatus.ACCEPT }, { idReceptor: req.params.id, status: EContactStatus.ACCEPT }] });
        const sendList = yield contact_model_1.default.find({ idSender: idUser, status: contact_enum_1.EContactStatus.ACCEPT }).populate('idReceptor');
        console.log('SEND LIST', sendList);
        const receptList = yield contact_model_1.default.find({ idReceptor: idUser, status: contact_enum_1.EContactStatus.ACCEPT }).populate('idSender');
        console.log('RECEPT LIST', receptList);
        sendList.forEach(item => {
            const contact = {
                id: item.id,
                idContact: item.idReceptor._id,
                name: item.idReceptor.profile.name,
                date: item.createdAt,
                urlImage: item.idReceptor.profile.imageUrl,
                description: 'Disponible',
            };
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
            };
            yourContactList.push(contact);
        });
        return res.status(200).json(yourContactList);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getContactsOfUser = getContactsOfUser;
const getRequestsRecived = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yourContactList = [];
        const idUser = req.params.id;
        if (!idUser)
            return res.status(500).json({ message: 'Ingrese un ID Grupi' });
        const receptList = yield contact_model_1.default.find({ idReceptor: idUser, status: contact_enum_1.EContactStatus.SEND }).populate('idSender');
        console.log(receptList);
        receptList.forEach(item => {
            const contact = {
                id: item.id,
                idContact: item.idSender._id,
                name: item.idSender.profile.name,
                date: item.createdAt,
                urlImage: item.idSender.profile.imageUrl,
                description: 'Disponible',
            };
            yourContactList.push(contact);
        });
        return res.status(200).json(yourContactList);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getRequestsRecived = getRequestsRecived;
const acceptRequestsRecived = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        console.log(id);
        if (!id)
            return res.status(500).json({ message: 'Debe enviar el id de la solicitud como parámetro.' });
        const contact = yield contact_model_1.default.findOne({ _id: id });
        console.log(contact);
        if (!contact) {
            return res.status(400).json({ msg: 'La solicitud no existe' });
        }
        const contactUpdated = yield contact_model_1.default.findOneAndUpdate({ _id: id }, { status: contact_enum_1.EContactStatus.ACCEPT }, { new: true });
        console.log(contactUpdated);
        const receptor = yield user_model_1.default.findOne({ _id: contact.idReceptor });
        const objNotification = {
            idGrupi: contact.idSender,
            title: `${receptor === null || receptor === void 0 ? void 0 : receptor.profile.name} ha aceptado tu solicitud`,
            description: `Ahora pueden ver sus perfiles e iniciar una conversación por chat.`,
            createdAt: new Date(),
            status: notification_1.ENotificationStatus.ACTIVE
        };
        const newNotification = new notification_model_1.default(objNotification);
        console.log(newNotification);
        yield newNotification.save();
        return res.status(200).json({ confirm: true });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error al aceptar solicitud' });
    }
});
exports.acceptRequestsRecived = acceptRequestsRecived;
const declineRequestsRecived = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(500).json({ message: 'Debe enviar el id de la solicitud como parámetro.' });
        const contact = yield contact_model_1.default.findOne({ _id: id });
        if (!contact) {
            return res.status(400).json({ msg: 'La solicitud no existe' });
        }
        yield contact_model_1.default.findOneAndUpdate({ id: id }, { status: contact_enum_1.EContactStatus.DECLINE }, { new: true });
        const receptor = yield user_model_1.default.findOne({ _id: contact.idReceptor });
        const objNotification = {
            idGrupi: contact.idSender,
            title: `${receptor === null || receptor === void 0 ? void 0 : receptor.profile.name} ha rechazado tu solicitud`,
            description: `Ahora pueden ver sus perfiles e iniciar una conversación por chat.`,
            createdAt: new Date(),
            status: notification_1.ENotificationStatus.ACTIVE
        };
        const newNotification = new notification_model_1.default(objNotification);
        yield newNotification.save();
        return res.status(200).json({ confirm: true });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error al rechazar la solicitud' });
    }
});
exports.declineRequestsRecived = declineRequestsRecived;
exports.default = {
    getContact: exports.getContact,
    getContacts: exports.getContacts,
    createContact: exports.createContact,
    updateContact: exports.updateContact,
    deleteContact: exports.deleteContact,
    getContactsOfUser: exports.getContactsOfUser,
    getRequestsRecived: exports.getRequestsRecived,
    acceptRequestsRecived: exports.acceptRequestsRecived,
    declineRequestsRecived: exports.declineRequestsRecived
};
