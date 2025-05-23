import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
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
    },    savedAddresses: [
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
    ],    savedPaymentMethods: [
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      }
    ]
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
