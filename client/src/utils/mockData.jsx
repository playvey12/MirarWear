export const catalogPhotos = Object.values(
  import.meta.glob('../assets/catalogItems/*.{png,jpg,jpeg,svg,webp}', { eager: true, import: 'default' })
);
export const gridPhotos = Object.values(
  import.meta.glob('../assets/grids/*.{png,jpg,jpeg,svg,webp}', { eager: true, import: 'default' })
);
import hoverPhoto from '../assets/hover.jpg';


export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomPhotosArray(count = 5) {
  if (catalogPhotos.length === 0) return ['/placeholder.jpg'];
  return [...catalogPhotos].sort(() => 0.5 - Math.random()).slice(0, count);
}
export const catalogItems = [
{
    id: 0,
    photo: catalogPhotos[getRandomInt(0, catalogPhotos.length - 1)] || '/placeholder.jpg',
    photos: getRandomPhotosArray(6),
gridPhoto:gridPhotos[getRandomInt(0, gridPhotos.length - 1)] ,
    hoverPhoto: hoverPhoto,
    brand: "MARCELO MIRACLES",
    name: "ADDRESS LOGO LONGSLEEVE in BLACK",
    features: [
      "КУЛИРКА 200Г, 95% ХЛОПОК, 5% ЭЛАСТАН",
      "ПАФФ-ПРИНТ",
      "ЖАККАРДОВАЯ БИРКА ВНУТРИ"
    ],
    fit: "УКОРОЧЕННЫЙ ОВЕРСАЙЗ.",
    price: 1000,
    category: "hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["black"],
    inStock: true,
    isNew: true,
    isSale: false
  },
  {
    id: 2,
    photo: catalogPhotos[getRandomInt(0, catalogPhotos.length - 1)] || '/placeholder.jpg',
    photos: getRandomPhotosArray(6),
gridPhoto:gridPhotos[getRandomInt(0, gridPhotos.length - 1)] ,
    hoverPhoto: hoverPhoto,
    brand: "MARCELO MIRACLES",
    name: "ADDRESS LOGO LONGSLEEVE in BLACK",
    features: [
      "КУЛИРКА 200Г, 95% ХЛОПОК, 5% ЭЛАСТАН",
      "ПАФФ-ПРИНТ",
      "ЖАККАРДОВАЯ БИРКА ВНУТРИ"
    ],
    fit: "УКОРОЧЕННЫЙ ОВЕРСАЙЗ.",
    price: 2000,
    category: "hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["black"],
    inStock: true,
    isNew: true,
    isSale: false
  },
  {
    id: 3,
    photo: catalogPhotos[getRandomInt(0, catalogPhotos.length - 1)] || '/placeholder.jpg',
    photos: getRandomPhotosArray(6),
gridPhoto:gridPhotos[getRandomInt(0, gridPhotos.length - 1)] ,
    hoverPhoto: hoverPhoto,
    brand: "MARCELO MIRACLES",
    name: "ADDRESS LOGO LONGSLEEVE in BLACK",
    features: [
      "КУЛИРКА 200Г, 95% ХЛОПОК, 5% ЭЛАСТАН",
      "ПАФФ-ПРИНТ",
      "ЖАККАРДОВАЯ БИРКА ВНУТРИ"
    ],
    fit: "УКОРОЧЕННЫЙ ОВЕРСАЙЗ.",
    price: 3000,
    category: "tshirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["black"],
    inStock: true,
    isNew: true,
    isSale: false
  },
  {
    id: 4,
    photo: catalogPhotos[getRandomInt(0, catalogPhotos.length - 1)] || '/placeholder.jpg',
    photos: getRandomPhotosArray(6),
gridPhoto:gridPhotos[getRandomInt(0, gridPhotos.length - 1)] ,
    hoverPhoto: hoverPhoto,
    brand: "MARCELO MIRACLES",
    name: "ADDRESS LOGO LONGSLEEVE in BLACK",
    features: [
      "КУЛИРКА 200Г, 95% ХЛОПОК, 5% ЭЛАСТАН",
      "ПАФФ-ПРИНТ",
      "ЖАККАРДОВАЯ БИРКА ВНУТРИ"
    ],
    fit: "УКОРОЧЕННЫЙ ОВЕРСАЙЗ.",
    price: 4000,
    category: "tshirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["black"],
    inStock: true,
    isNew: true,
    isSale: false
  },

  {
    id: 5,
    photo: catalogPhotos[getRandomInt(0, catalogPhotos.length - 1)] || '/placeholder.jpg',
    hoverPhoto: hoverPhoto,
    photos: getRandomPhotosArray(6),
gridPhoto:gridPhotos[getRandomInt(0, gridPhotos.length - 1)] ,


    brand: "GOTHIC",
    name: "10 YEARS GOTHIC LOGO HOODIE IN GREY",
    features: [
      "ВЫСОКОКАЧЕСТВЕННЫЙ ХЛОПОК 400Г",
      "ПРИНТ С ЭФФЕКТОМ СТАРЕНИЯ",
      "ОГРАНИЧЕННЫЙ ТИРАЖ К 10-ЛЕТИЮ"
    ],
    fit: "ПЛОТНЫЙ ОВЕРСАЙЗ КРОЙ.",
    oldPrice: 6000,
    price: 5000,
    discount: 25,
    category: "pants",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["grey", "black"],
    rating: 4.8,
    reviews: 127,
    inStock: true,
    isNew: false,
    isSale: true
  },
  {
    id: 6,
    photo: catalogPhotos[getRandomInt(0, catalogPhotos.length - 1)] || '/placeholder.jpg',
    hoverPhoto: hoverPhoto,
    photos: getRandomPhotosArray(6),
gridPhoto:gridPhotos[getRandomInt(0, gridPhotos.length - 1)] ,


    brand: "GOTHIC",
    name: "SKULL EMBROIDERY DENIM JACKET",
    features: [
      "ПЛОТНЫЙ ПОТЕРТЫЙ ДЕНИМ",
      "ДЕТАЛЬНАЯ ВЫШИВКА ЧЕРЕПА НА СПИНЕ",
      "МЕТАЛЛИЧЕСКИЕ БРЕНДИРОВАННЫЕ ПУГОВИЦЫ"
    ],
    fit: "КЛАССИЧЕСКИЙ ПРЯМОЙ КРОЙ.",
    oldPrice: 8500,
    price: 6000,
    discount: 15,
    category: "pants",
    sizes: ["S", "M", "L", "XL"],
    colors: ["blue", "black"],
    rating: 4.9,
    reviews: 89,
    inStock: true,
    isNew: true,
    isSale: true
  },
  {
    id: 7,
    photo: catalogPhotos[getRandomInt(0, catalogPhotos.length - 1)] || '/placeholder.jpg',
    hoverPhoto: hoverPhoto,
    photos: getRandomPhotosArray(6),
gridPhoto:gridPhotos[getRandomInt(0, gridPhotos.length - 1)] ,


    brand: "GOTHIC",
    name: "SKULL EMBROIDERY DENIM JACKET",
    features: [
      "ПЛОТНЫЙ ПОТЕРТЫЙ ДЕНИМ",
      "ДЕТАЛЬНАЯ ВЫШИВКА ЧЕРЕПА НА СПИНЕ",
      "МЕТАЛЛИЧЕСКИЕ БРЕНДИРОВАННЫЕ ПУГОВИЦЫ"
    ],
    fit: "КЛАССИЧЕСКИЙ ПРЯМОЙ КРОЙ.",
    oldPrice: 8500,
    price: 7000,
    discount: 15,
    category: "shorts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["blue", "black"],
    rating: 4.9,
    reviews: 89,
    inStock: true,
    isNew: true,
    isSale: true
  },
  {
    id: 8,
    photo: catalogPhotos[getRandomInt(0, catalogPhotos.length - 1)] || '/placeholder.jpg',
    hoverPhoto: hoverPhoto,
    photos: getRandomPhotosArray(6),
gridPhoto:gridPhotos[getRandomInt(0, gridPhotos.length - 1)] ,


    brand: "GOTHIC",
    name: "SKULL EMBROIDERY DENIM JACKET",
    features: [
      "ПЛОТНЫЙ ПОТЕРТЫЙ ДЕНИМ",
      "ДЕТАЛЬНАЯ ВЫШИВКА ЧЕРЕПА НА СПИНЕ",
      "МЕТАЛЛИЧЕСКИЕ БРЕНДИРОВАННЫЕ ПУГОВИЦЫ"
    ],
    fit: "КЛАССИЧЕСКИЙ ПРЯМОЙ КРОЙ.",
    oldPrice: 8500,
    price: 8000,
    discount: 15,
    category: "shorts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["blue", "black"],
    rating: 4.9,
    reviews: 89,
    inStock: true,
    isNew: true,
    isSale: true
  },
  {
    id: 9,
    photo: catalogPhotos[getRandomInt(0, catalogPhotos.length - 1)] || '/placeholder.jpg',
    hoverPhoto: hoverPhoto,
    photos: getRandomPhotosArray(6),
gridPhoto:gridPhotos[getRandomInt(0, gridPhotos.length - 1)] ,


    brand: "GOTHIC",
    name: "SKULL EMBROIDERY DENIM JACKET",
    features: [
      "ПЛОТНЫЙ ПОТЕРТЫЙ ДЕНИМ",
      "ДЕТАЛЬНАЯ ВЫШИВКА ЧЕРЕПА НА СПИНЕ",
      "МЕТАЛЛИЧЕСКИЕ БРЕНДИРОВАННЫЕ ПУГОВИЦЫ"
    ],
    fit: "КЛАССИЧЕСКИЙ ПРЯМОЙ КРОЙ.",
    oldPrice: 8500,
    price: 9000,
    discount: 15,
    category: "bags",
    sizes: ["S", "M", "L", "XL"],
    colors: ["blue", "black"],
    rating: 4.9,
    reviews: 89,
    inStock: true,
    isNew: true,
    isSale: true
  },
  {
    id: 10,
    photo: catalogPhotos[getRandomInt(0, catalogPhotos.length - 1)] || '/placeholder.jpg',
    hoverPhoto: hoverPhoto,
    photos: getRandomPhotosArray(6),
gridPhoto:gridPhotos[getRandomInt(0, gridPhotos.length - 1)] ,


    brand: "GOTHIC",
    name: "SKULL EMBROIDERY DENIM JACKET",
    features: [
      "ПЛОТНЫЙ ПОТЕРТЫЙ ДЕНИМ",
      "ДЕТАЛЬНАЯ ВЫШИВКА ЧЕРЕПА НА СПИНЕ",
      "МЕТАЛЛИЧЕСКИЕ БРЕНДИРОВАННЫЕ ПУГОВИЦЫ"
    ],
    fit: "КЛАССИЧЕСКИЙ ПРЯМОЙ КРОЙ.",
    oldPrice: 8500,
    price: 10000,
    discount: 15,
    category: "bags",
    sizes: ["S", "M", "L", "XL"],
    colors: ["blue", "black"],
    rating: 4.9,
    reviews: 89,
    inStock: true,
    isNew: true,
    isSale: true
  },
   {
    id: 11,
    photo: catalogPhotos[getRandomInt(0, catalogPhotos.length - 1)] || '/placeholder.jpg',
    hoverPhoto: hoverPhoto,
    photos: getRandomPhotosArray(6),
gridPhoto:gridPhotos[getRandomInt(0, gridPhotos.length - 1)] ,


    brand: "GOTHIC",
    name: "SKULL EMBROIDERY DENIM JACKET",
    features: [
      "ПЛОТНЫЙ ПОТЕРТЫЙ ДЕНИМ",
      "ДЕТАЛЬНАЯ ВЫШИВКА ЧЕРЕПА НА СПИНЕ",
      "МЕТАЛЛИЧЕСКИЕ БРЕНДИРОВАННЫЕ ПУГОВИЦЫ"
    ],
    fit: "КЛАССИЧЕСКИЙ ПРЯМОЙ КРОЙ.",
    oldPrice: 8500,
    price: 11000,
    discount: 15,
    category: "accessories",
    sizes: ["S", "M", "L", "XL"],
    colors: ["blue", "black"],
    rating: 4.9,
    reviews: 89,
    inStock: true,
    isNew: true,
    isSale: true
  },

];

export const categories = [
  { id: 'all', name: 'Все товары' },
  { id: 'hoodies', name: 'Худи' },
  { id: 'tshirts', name: 'Футболки' },
  { id: 'jackets', name: 'Куртки' },
  { id: 'pants', name: 'Штаны' },
  { id: 'dresses', name: 'Платья' },
  { id: 'accessories', name: 'Аксессуары' },
  { id: 'decor', name: 'Декор' }
];

export const getItemById = (id) => catalogItems.find(item => item.id === id);