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
const authMiddleware_1 = require("./authMiddleware");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    // Hachage du mot de passe
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        // Création de l'utilisateur
        const user = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ error: "L'utilisateur ne peut pas être créé" });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "Utilisateur non trouvé" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Mot de passe incorrect" });
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        // Génération du JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ error: "Erreur de connexion" });
    }
}));
router.patch('/update', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId)
        return res.sendStatus(404);
    try {
        const updatedUser = yield prisma.user.update({
            where: { id: userId },
            data: { name },
        });
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
}));
exports.default = router;
