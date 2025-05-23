import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product';

// Load environment variables
dotenv.config();

// Sample products data
const products = [
  {
    name: "Silhouette No. 1 - Vermilion",
    description: "A tailored composition in vermilion. Cut from structured wool with a peaked neckline, this silhouette is all attitude. Captures precision without force. Wear it wherever an edge is very welcome.",
    price: 7999,
    images: [
      "/api/images/vermilion-1.jpg",
      "/api/images/vermilion-2.jpg",
      "/api/images/vermilion-3.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Outerwear",
    stock: 20,
  },
  {
    name: "Silhouette No. 2 - Obsidian",
    description: "A study in contrasts. This obsidian piece features clean lines and a relaxed silhouette that creates a sophisticated shadow. Perfect for evening events or making a subtle statement.",
    price: 8999,
    images: [
      "/api/images/vermilion-1.jpg", // Using same images for sample data
      "/api/images/vermilion-2.jpg",
      "/api/images/vermilion-3.jpg",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Outerwear",
    stock: 15,
  },
  {
    name: "Silhouette No. 3 - Ivory",
    description: "Ethereal and elegant. This ivory piece flows with movement, creating a silhouette that's both bold and delicate. Made from premium wool blend with subtle texture.",
    price: 6999,
    images: [
      "/api/images/vermilion-1.jpg", // Using same images for sample data
      "/api/images/vermilion-2.jpg",
      "/api/images/vermilion-3.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    category: "Dresses",
    stock: 12,
  }
];

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eclypse';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Clear existing products
      await Product.deleteMany();
      console.log('Products cleared');

      // Insert new products
      const createdProducts = await Product.insertMany(products);
      console.log(`${createdProducts.length} products created`);
      
      // Close connection
      mongoose.disconnect();
      console.log('Database seeded successfully');
      process.exit(0);
    } catch (error) {
      console.error('Error seeding database:', error);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
