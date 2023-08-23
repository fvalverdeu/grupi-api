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
exports.getRequestsRecived = exports.getContactsOfUser = exports.deleteContact = exports.updateContact = exports.createContact = exports.getContacts = exports.getContact = void 0;
const contact_model_1 = __importDefault(require("../models/contact.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const visit_model_1 = __importDefault(require("../models/visit.model"));
const contact_enum_1 = require("../constants/contact.enum");
const getContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idContact = req.params.id;
        const idUser = req.body.id;
        const yourContactList = [];
        const yourPlaceList = [];
        const contactProfile = yield user_model_1.default.findOne({ _id: idContact });
        if (!contactProfile)
            return res.status(500).json({ message: 'El usuario no existe' });
        const contact = yield contact_model_1.default.findOne({
            $or: [{ idSender: idContact, idReceptor: idUser },
                { idSender: idUser, idReceptor: idContact }
            ]
        });
        if ((contact === null || contact === void 0 ? void 0 : contact.status) == contact_enum_1.EContactStatus.ACCEPT) {
            const sendList = yield contact_model_1.default.find({ idSender: idContact, status: contact_enum_1.EContactStatus.ACCEPT }).populate('idSender');
            const receptList = yield contact_model_1.default.find({ idReceptor: idContact, status: contact_enum_1.EContactStatus.ACCEPT }).populate('idReceptor');
            sendList.forEach(item => {
                const contactOfMyContact = {
                    id: item.idSender._id,
                    name: item.idSender.profile.name,
                };
                yourContactList.push(contactOfMyContact);
            });
            receptList.forEach(item => {
                const contactOfMyContact = {
                    id: item.idReceptor._id,
                    name: item.idReceptor.profile.name,
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
            id: idContact,
            profile: contactProfile.profile,
            isContact: contact === null || contact === void 0 ? void 0 : contact.status,
            places: yourPlaceList,
            contacts: yourContactList
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
        const newContact = new contact_model_1.default(req.body);
        yield newContact.save();
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
        const contacts = yield contact_model_1.default.find({ $or: [{ idSender: req.params.id, status: contact_enum_1.EContactStatus.ACCEPT }, { idReceptor: req.params.id, status: contact_enum_1.EContactStatus.ACCEPT }] });
        return res.status(200).json(contacts);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getContactsOfUser = getContactsOfUser;
const getRequestsRecived = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield contact_model_1.default.find({ $or: [{ idReceptor: req.params.id }] });
        return res.status(200).json(contacts);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getRequestsRecived = getRequestsRecived;
exports.default = {
    getContact: exports.getContact,
    getContacts: exports.getContacts,
    createContact: exports.createContact,
    updateContact: exports.updateContact,
    deleteContact: exports.deleteContact,
    getContactsOfUser: exports.getContactsOfUser,
    getRequestsRecived: exports.getRequestsRecived,
};
