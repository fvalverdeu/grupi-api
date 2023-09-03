"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const place_routes_1 = __importDefault(require("./routes/place.routes"));
const visit_routes_1 = __importDefault(require("./routes/visit.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const preference_routes_1 = __importDefault(require("./routes/preference.routes"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./middlewares/passport"));
// initializations
const app = (0, express_1.default)();
// settings
app.set('port', process.env.PORT || 3000);
// middlewares
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
passport_1.default.use(passport_2.default);
// routes
app.get('/', (req, res) => {
    res.send(`THE API is at http://localhost:${app.get('port')}`);
});
app.use('/assets', express_1.default.static('dist/assets'));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/places', place_routes_1.default);
app.use('/api/visits', visit_routes_1.default);
app.use('/api/contacts', contact_routes_1.default);
app.use('/api/preferences', preference_routes_1.default);
exports.default = app;
