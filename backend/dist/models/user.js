"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    }, savedAddresses: [
        {
            id: String,
            fullName: String,
            address: String,
            city: String,
            postalCode: String,
            country: String,
            phone: String,
            isDefault: {
                type: Boolean,
                default: false,
            }
        }
    ], savedPaymentMethods: [
        {
            id: String,
            type: {
                type: String,
                enum: ['credit_card', 'paypal'],
                required: true,
            },
            cardLastFour: String,
            cardType: String,
            expiry: String,
            isDefault: {
                type: Boolean,
                default: false,
            },
            // Note: We don't store full card details, only tokens or last 4 digits
            // The actual payment processing would be done through a payment gateway
            token: String
        }
    ],
    isReturningCustomer: {
        type: Boolean,
        default: false,
    },
    orderHistory: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Order',
        }
    ]
}, {
    timestamps: true,
});
// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
