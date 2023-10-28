import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import placeRoutes from "./routes/place.routes";
import visitRoutes from "./routes/visit.routes";
import contactRoutes from "./routes/contact.routes";
import preferencesRoutes from "./routes/preference.routes";
import notificationRoutes from "./routes/notification.routes";

import passport from "passport";
import passportMiddleware from "./middlewares/passport";

// initializations
const app = express();

// settings
app.set('port', process.env.PORT || 3000);


// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
passport.use(passportMiddleware);


// routes
app.get('/', (req, res) => {
    res.send(`THE API is at http://localhost:${app.get('port')}`);
});

app.use('/assets', express.static('dist/assets'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/notifications', notificationRoutes);

export default app;