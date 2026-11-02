import type { Catalog } from "@/domain/product";

const redShirt =
  "https://images.unsplash.com/photo-1562157873-818bc0726f68?rect=75,100,1300,1750&auto=format&fit=crop&w=900&q=80";
const greenShirt =
  "https://images.unsplash.com/photo-1633966887768-64f9a867bdba?auto=format&fit=crop&w=400&q=80";
const blueShirt =
  "https://images.unsplash.com/photo-1562157873-818bc0726f68?rect=1580,2200,1320,1500&auto=format&fit=crop&w=400&q=80";
const blackShirt =
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=80";
const grayShirt =
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80";

export const catalogFixture: Catalog = {
  product: {
    id: "tiger-medium-red",
    title: "Tiger Medium Red",
    price: { amount: 250, currency: "AED" },
    imageUrl: redShirt,
    category: "MEN",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { id: "black", name: "Black", hex: "#1a1a1a" },
      { id: "mist", name: "Mist", hex: "#d5ddd8" },
      { id: "white", name: "White", hex: "#ffffff" },
      { id: "forest", name: "Forest", hex: "#12382f" },
    ],
    description: {
      summary:
        "Opt for a bold look with this T-shirt. With its iconic Tiger print on the chest, it is sure to turn heads. Pair it with jogging trousers and sneakers for a casual sportswear look.",
      details: ["Short sleeved T-shirt.", "Round neck.", "Tiger embroidered on the chest."],
    },
  },
  relatedProducts: [
    { id: "tiger-forest", title: "Tiger Forest Green", imageUrl: greenShirt },
    { id: "tiger-blue", title: "Tiger Light Blue", imageUrl: blueShirt },
    { id: "tiger-black", title: "Tiger Black", imageUrl: blackShirt },
    { id: "tiger-gray", title: "Tiger Light Gray", imageUrl: grayShirt },
  ],
};
