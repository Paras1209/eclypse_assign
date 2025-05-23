// // ProductDetails.tsx
// import { useState } from "react";

// type Product = {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   images: string[];
//   sizes: string[];
// };

// type Props = {
//   product: Product;
// };

// export default function ProductDetails({ product }: Props) {
//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

//   const toggleDropdown = (key: string) => {
//     setActiveDropdown(prev => (prev === key ? null : key));
//   };

//   return (
//     <div className="bg-black text-white min-h-screen p-6 space-y-10">
//       <h1 className="text-xl font-light">{product.name}</h1>

//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Left: Primary Image */}
//         <div>
//           <img src={product.images[0]} alt={product.name} className="w-full object-cover rounded-xl" />
//         </div>

//         {/* Right: Details */}
//         <div className="space-y-4">
//           <p className="text-sm text-gray-300">{product.description}</p>

//           {/* Thumbnails */}
//           <div className="flex gap-2">
//             {product.images.map((img, idx) => (
//               <img key={idx} src={img} alt={`thumb-${idx}`} className="w-16 h-20 object-cover rounded-md" />
//             ))}
//           </div>

//           {/* Price */}
//           <div className="text-2xl font-medium mt-4">₹ {product.price.toLocaleString()}</div>

//           {/* Sizes */}
//           <div className="mt-2">
//             <p className="text-sm mb-1">Please select a size:</p>
//             <div className="flex gap-2">
//               {product.sizes.map((size) => (
//                 <button
//                   key={size}
//                   onClick={() => setSelectedSize(size)}
//                   className={`px-4 py-1 border rounded ${selectedSize === size ? "bg-white text-black" : "text-white border-white"}`}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-4 mt-4">
//             <button className="border border-white px-6 py-2 rounded hover:bg-white hover:text-black transition">Add to Cart</button>
//             <button className="bg-white text-black px-6 py-2 rounded">Buy</button>
//           </div>
//         </div>
//       </div>

//       {/* Dropdowns */}
//       <div className="space-y-4">
//         {["Size & Fit", "Delivery & Returns", "How This Was Made"].map((section) => (
//           <div key={section}>
//             <button
//               onClick={() => toggleDropdown(section)}
//               className="flex justify-between w-full text-left py-2 border-b border-gray-600"
//             >
//               <span>{section}</span>
//               <span>{activeDropdown === section ? "▲" : "▼"}</span>
//             </button>
//             {activeDropdown === section && (
//               <div className="text-sm text-gray-400 mt-2">
//                 {/* Replace with actual content */}
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// components/ProductDetails.tsx
import { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../lib/CartContext";

const dummyProduct = {
  id: "1",
  name: "Silhouette No. 1 - Vermilion",
  description:
    "A tailored composition in vermilion. Cut from structured wool with a peaked neckline, this silhouette is all attitude. Captures precision without force. Wear it wherever an edge is very welcome.",
  price: 7999,
  images: [
    "assets/product-images/vermilion-1.jpg",
    "assets/product-images/vermilion-2.jpg",
    "assets/product-images/vermilion-3.jpg",
  ],
  sizes: ["XS", "S", "M", "L", "XL"],
};

export default function ProductDetails() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const toggleDropdown = (key: string) => {
    setActiveDropdown(prev => (prev === key ? null : key));
  };
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addToCart({
      id: dummyProduct.id,
      name: dummyProduct.name,
      price: dummyProduct.price,
      image: dummyProduct.images[0],
      quantity: 1,
      size: selectedSize,
    });

    alert('Item added to cart successfully!');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addToCart({
      id: dummyProduct.id,
      name: dummyProduct.name,
      price: dummyProduct.price,
      image: dummyProduct.images[0],
      quantity: 1,
      size: selectedSize,
    });

    navigate('/checkout');
  };
  return (
    <div className="text-white min-h-screen space-y-6 sm:space-y-10">

      {/* Product Title */}
      <div className="px-4 sm:m-10 sm:my-30 sm:p-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-normal">{dummyProduct.name}</h1>
      </div> 

      {/* Product Image and Details */}
      <div className="bg-white text-black grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 sm:mt-40 sm:mb-30">
        {/* Left: Primary Image */}
        <div className="px-4 sm:px-0">
          <img
            src={dummyProduct.images[0]}
            alt={dummyProduct.name}
            className="w-full object-cover rounded-xl"
          />
        </div>

        {/* Right: Details */}
        <div className="px-4 sm:px-0 sm:mr-10">
          <p className="text-sm sm:text-medium font-medium mt-4 sm:mt-10">{dummyProduct.description}</p>

          {/* Thumbnails */}
          <div className="flex gap-2 sm:gap-3 py-4 sm:py-10 mb-3 sm:mb-5 border-b-2 border-gray-200 overflow-x-auto">
            {dummyProduct.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className="w-24 sm:w-1/3 h-auto object-cover flex-shrink-0"
              />
            ))}
          </div>

          {/* Price */}
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold my-4 pb-3 sm:pb-5">
            ₹ {dummyProduct.price.toLocaleString()} 
            <span className="block sm:inline text-xs font-medium text-gray-500 mt-1 sm:mt-0 sm:ml-2">MRP incl. of all taxes</span>
          </div>

          {/* Sizes */}
          <div className="mt-2 border-b-2 border-gray-200 pb-6 sm:pb-14 mb-6 sm:mb-20">
            <p className="text-base sm:text-lg text-gray-500 mb-4 sm:mb-10">Please select a size:</p>
            <div className="flex flex-wrap gap-2 sm:gap-8 text-xs sm:text-sm">
              {dummyProduct.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 sm:px-7 py-2 sm:py-3 bg-[#d9d9d9] rounded ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "text-black border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3 sm:gap-6 mt-4">
            <button 
              onClick={handleAddToCart}
              className="border-2 text-sm sm:text-lg font-medium w-1/3 border-gray-300 px-2 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-black hover:text-white transition"
            >
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="bg-black w-2/3 text-white text-sm sm:text-lg font-medium py-2 sm:py-3 rounded-md"
            >
              Buy
            </button>
          </div>
        </div>
      </div>

      {/* Product Information Dropdowns */}
      <div className="space-y-4 sm:space-y-6 px-4 sm:m-14 sm:my-20">
        <div className="mb-4 sm:mb-15">
          <button
            onClick={() => toggleDropdown("Size & Fit")}
            className="flex justify-between w-full text-left pb-4 sm:pb-10 pt-2 sm:pt-15 px-2 border-b border-b-gray-800"
          >
            <span className="text-xl sm:text-2xl md:text-3xl">Size & Fit</span>
            <span className="text-lg sm:text-xl">{activeDropdown === "Size & Fit" ? <FaArrowUp /> : <FaArrowDown />}</span>
          </button>
          {activeDropdown === "Size & Fit" && (
            <div className="text-base sm:text-lg text-gray-400 mt-4 p-2 sm:p-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque corporis quae asperiores accusamus facilis minus atque similique cupiditate maiores, nesciunt labore. Magni enim odit dolorum aliquid doloremque pariatur eius voluptas.
            </div>
          )}
        </div>

        <div className="mb-4 sm:mb-15">
          <button
            onClick={() => toggleDropdown("Delivery & Returns")}
            className="flex justify-between w-full text-left py-2 sm:py-6 px-2 pb-4 sm:pb-10 border-b-2 border-gray-800"
          >
            <span className="text-xl sm:text-2xl md:text-3xl">Delivery & Returns</span>
            <span className="text-lg sm:text-2xl">{activeDropdown === "Delivery & Returns" ? <FaArrowUp /> : <FaArrowDown />}</span>
          </button>
          {activeDropdown === "Delivery & Returns" && (
            <div className="text-base sm:text-lg text-gray-400 mt-4 p-2 sm:p-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque cumque animi modi sed, assumenda ducimus unde necessitatibus suscipit libero consectetur sapiente, magni quaerat repellat aut nostrum nobis autem natus hic.
            </div>
          )}
        </div>

        <div className="mb-4">
          <button
            onClick={() => toggleDropdown("How This Was Made")}
            className="flex justify-between w-full text-left py-2 sm:py-4 px-2 border-b-2 border-gray-800 pb-4 sm:pb-10"
          >
            <span className="text-xl sm:text-2xl md:text-3xl">How This Was Made</span>
            <span className="text-lg sm:text-2xl">{activeDropdown === "How This Was Made" ? <FaArrowUp /> : <FaArrowDown />}</span>
          </button>
          {activeDropdown === "How This Was Made" && (
            <div className="text-base sm:text-lg text-gray-400 mt-4 p-2 sm:p-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, recusandae? Dolorum eos sunt aliquid, nulla accusamus hic dolores natus quo aut culpa impedit iusto, architecto ipsum ex temporibus quidem doloribus.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
