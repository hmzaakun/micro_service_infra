"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("./authController")); // Assurez-vous que le chemin d'importation est correct
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// Utilisation des routes d'authentification
app.use('/api/auth', authController_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
