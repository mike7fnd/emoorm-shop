import { PlaceHolderImages } from './placeholder-images';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: {
    src: string;
    hint: string;
  };
  category: string;
  brand: string;
  onSale?: boolean;
  stock: number;
  dateAdded: string; // ISO 8601 date string
  popularity: number; // A score from 0 to 1
  sold: number;
  rating?: number;
  isAuction?: boolean;
  currentBid?: number;
  bidEndTime?: string; // ISO 8601 date string
};

export type StoreGenre = {
  icon: string;
  text: string;
};

export type Store = {
  id: string;
  name: string;
  address: string;
  about: string;
  image: {
    src: string;
    hint: string;
  };
  rating: number;
  productCount: number;
  followers: number;
  lat: number;
  lng: number;
  genres: StoreGenre[];
};

export const placeholderImageMap = new Map(PlaceHolderImages.map(p => [p.id, { src: p.imageUrl, hint: p.imageHint }]));

export const products: Product[] = [
  {
    id: '1',
    name: 'Fresh Calamansi (1kg)',
    description: 'Sweet and tangy calamansi, freshly picked from local Mindoro farms. Perfect for juices and marinades.',
    price: 80,
    image: placeholderImageMap.get('1')!,
    category: 'Fresh Produce',
    brand: 'Calapan Agri-Hub',
    onSale: true,
    stock: 50,
    dateAdded: '2024-07-20T10:00:00Z',
    popularity: 0.9,
    sold: 12000,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Organic Rambutan (1kg)',
    description: 'Juicy and sweet rambutan, grown without pesticides. A local favorite seasonal fruit.',
    price: 120,
    image: placeholderImageMap.get('2')!,
    category: 'Fresh Produce',
    brand: 'Naujan Organics',
    stock: 30,
    dateAdded: '2024-07-18T11:00:00Z',
    popularity: 0.8,
    sold: 8000,
    rating: 4.7,
  },
  {
    id: '3',
    name: 'Wild Honey (500ml)',
    description: 'Pure, raw honey harvested from the forests of Mount Halcon. Rich in flavor and nutrients.',
    price: 350,
    image: placeholderImageMap.get('3')!,
    category: 'Local Delicacies',
    brand: 'Mangyan Heritage Crafts',
    stock: 8,
    dateAdded: '2024-07-21T14:30:00Z',
    popularity: 0.95,
    sold: 5000,
    rating: 4.9,
  },
  {
    id: '4',
    name: 'Handwoven Nito Basket',
    description: 'A beautifully crafted basket made from native Nito vines by local artisans.',
    price: 550,
    image: placeholderImageMap.get('4')!,
    category: 'Handicrafts',
    brand: 'Mangyan Heritage Crafts',
    stock: 1,
    dateAdded: '2024-06-30T09:00:00Z',
    popularity: 0.7,
    sold: 250,
    isAuction: true,
    currentBid: 480,
    bidEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Ends in 2 days
  },
  {
    id: '5',
    name: 'Dried Fish (Tuyo)',
    description: 'Salty and savory dried fish, a staple in Filipino breakfast. Sourced from the coastal towns of Mindoro.',
    price: 150,
    image: placeholderImageMap.get('5')!,
    category: 'Local Delicacies',
    brand: 'Calapan Agri-Hub',
    onSale: true,
    stock: 5,
    dateAdded: '2024-07-15T08:00:00Z',
    popularity: 0.85,
    sold: 15000,
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Banana Chips (250g)',
    description: 'Crispy and sweet banana chips made from Mindoro saba bananas. A perfect snack.',
    price: 100,
    image: placeholderImageMap.get('6')!,
    category: 'Local Delicacies',
    brand: 'Naujan Organics',
    stock: 100,
    dateAdded: '2024-07-05T12:00:00Z',
    popularity: 0.75,
    sold: 3000,
    rating: 4.5,
  },
  {
    id: '7',
    name: 'Mindoro Cashew Nuts (500g)',
    description: 'Roasted cashew nuts from the hills of Mindoro. A healthy and delicious treat.',
    price: 400,
    image: placeholderImageMap.get('7')!,
    category: 'Local Delicacies',
    brand: 'Calapan Agri-Hub',
    stock: 40,
    dateAdded: '2024-07-22T10:00:00Z',
    popularity: 0.88,
    sold: 4500,
    rating: 4.9,
  },
  {
    id: '8',
    name: 'Tablea Cacao Balls',
    description: 'Pure, unsweetened cacao balls for making rich, traditional hot chocolate.',
    price: 200,
    image: placeholderImageMap.get('8')!,
    category: 'Local Delicacies',
    brand: 'Naujan Organics',
    stock: 25,
    dateAdded: '2024-07-19T16:00:00Z',
    popularity: 0.82,
    sold: 1800,
    rating: 4.8,
  },
  {
    id: '9',
    name: 'Buri Palm Bag',
    description: 'A stylish and durable shoulder bag handwoven from Buri palm leaves.',
    price: 450,
    image: placeholderImageMap.get('9')!,
    category: 'Handicrafts',
    brand: 'Mangyan Heritage Crafts',
    stock: 1,
    dateAdded: '2024-07-10T13:20:00Z',
    popularity: 0.65,
    sold: 400,
    isAuction: true,
    currentBid: 320,
    bidEndTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // Ends in 1 day 3 hours
  },
  {
    id: '10',
    name: 'Fresh Mangoes (1kg)',
    description: 'Sweet, golden mangoes, the pride of the Philippines, from sunny Mindoro fields.',
    price: 180,
    image: placeholderImageMap.get('10')!,
    category: 'Fresh Produce',
    brand: 'Calapan Agri-Hub',
    stock: 60,
    dateAdded: '2024-07-23T09:00:00Z',
    popularity: 0.98,
    sold: 20000,
    rating: 5.0,
  },
  {
    id: '11',
    name: 'Coconut Vinegar (750ml)',
    description: 'Organic, fermented coconut vinegar. Adds a sharp, delicious tang to any dish.',
    price: 90,
    image: placeholderImageMap.get('11')!,
    category: 'Pantry Staples',
    brand: 'Naujan Organics',
    stock: 150,
    dateAdded: '2024-07-01T11:00:00Z',
    popularity: 0.5,
    sold: 700,
    rating: 4.4,
  },
  {
    id: '12',
    name: 'Lanzones (1kg)',
    description: 'Sweet and succulent Lanzones, a seasonal delight from local orchards.',
    price: 150,
    image: placeholderImageMap.get('12')!,
    category: 'Fresh Produce',
    brand: 'Calapan Agri-Hub',
    stock: 9,
    dateAdded: '2024-07-17T14:00:00Z',
    popularity: 0.78,
    sold: 2200,
    rating: 4.6,
  },
  {
    id: '13',
    name: 'Suman sa Lihia',
    description: 'A local delicacy of steamed glutinous rice wrapped in banana leaves.',
    price: 120,
    image: placeholderImageMap.get('13')!,
    category: 'Local Delicacies',
    brand: "Puerto Galera's Finest",
    stock: 40,
    dateAdded: '2024-07-12T10:30:00Z',
    popularity: 0.6,
    sold: 900,
    rating: 4.5,
  },
  {
    id: '14',
    name: 'Barako Coffee Beans (250g)',
    description: 'Strong, aromatic Barako coffee beans, grown in the highlands of Mindoro.',
    price: 250,
    image: placeholderImageMap.get('14')!,
    category: 'Pantry Staples',
    brand: 'Calapan Agri-Hub',
    stock: 75,
    dateAdded: '2024-07-20T18:00:00Z',
    popularity: 0.92,
    sold: 6000,
    rating: 4.9,
  },
  {
    id: '15',
    name: 'Homemade Ube Jam (250g)',
    description: 'Rich and creamy purple yam jam, a classic Filipino dessert spread.',
    price: 180,
    image: placeholderImageMap.get('15')!,
    category: 'Local Delicacies',
    brand: "Puerto Galera's Finest",
    stock: 22,
    dateAdded: '2024-07-18T13:00:00Z',
    popularity: 0.89,
    sold: 3500,
    rating: 5.0,
  },
  {
    id: '16',
    name: 'Sweet Tamarind Candy',
    description: 'A sweet and sour treat made from local tamarind pulp.',
    price: 70,
    image: placeholderImageMap.get('16')!,
    category: 'Local Delicacies',
    brand: 'Naujan Organics',
    onSale: true,
    stock: 200,
    dateAdded: '2024-07-08T15:00:00Z',
    popularity: 0.4,
    sold: 800,
    rating: 4.2,
  },
  {
    id: '17',
    name: 'Hand-painted Bayong Bag',
    description: 'A traditional Filipino woven bag, hand-painted with unique local designs.',
    price: 600,
    image: placeholderImageMap.get('17')!,
    category: 'Handicrafts',
    brand: 'Mangyan Heritage Crafts',
    stock: 12,
    dateAdded: '2024-07-11T11:45:00Z',
    popularity: 0.72,
    sold: 150,
    rating: 4.7,
  },
  {
    id: '18',
    name: 'Virgin Coconut Oil (250ml)',
    description: 'Cold-pressed, organic virgin coconut oil. Multi-purpose for health and beauty.',
    price: 280,
    image: placeholderImageMap.get('18')!,
    category: 'Wellness & Herbs',
    brand: 'Naujan Organics',
    stock: 45,
    dateAdded: '2024-07-24T10:00:00Z',
    popularity: 0.85,
    sold: 1200,
    rating: 4.8,
  },
  {
    id: '19',
    name: 'Woven Wall Decor',
    description: 'Artistic wall hanging made from native fibers. Adds a touch of Mindoro to your home.',
    price: 850,
    image: placeholderImageMap.get('19')!,
    category: 'Home Decor',
    brand: 'Mangyan Heritage Crafts',
    stock: 5,
    dateAdded: '2024-07-25T09:00:00Z',
    popularity: 0.6,
    sold: 80,
    rating: 4.9,
  },
  {
    id: '20',
    name: 'Guyabano Juice (500ml)',
    description: 'Fresh guyabano juice, known for its health benefits and refreshing taste.',
    price: 110,
    image: placeholderImageMap.get('20')!,
    category: 'Beverages',
    brand: 'Calapan Agri-Hub',
    stock: 35,
    dateAdded: '2024-07-25T14:00:00Z',
    popularity: 0.75,
    sold: 1500,
    rating: 4.7,
  },
  {
    id: '21',
    name: 'Native Woven Hat',
    description: 'Stylish and protective hat handwoven from sturdy palm leaves.',
    price: 320,
    image: placeholderImageMap.get('22')!,
    category: 'Native Fashion',
    brand: 'Mangyan Heritage Crafts',
    stock: 15,
    dateAdded: '2024-07-20T11:00:00Z',
    popularity: 0.68,
    sold: 300,
    rating: 4.6,
  }
];

export const stores: Store[] = [
  {
    id: '1',
    name: 'Calapan Agri-Hub',
    address: 'Central Market, Calapan City',
    about: 'Your one-stop shop for the freshest produce from Mindoro. We partner with local farmers to bring you the best quality fruits, vegetables, and pantry staples directly from the source.',
    image: placeholderImageMap.get('store-1')!,
    rating: 4.8,
    productCount: 45,
    followers: 1200,
    lat: 13.4121,
    lng: 121.1764,
    genres: [
      { icon: 'Carrot', text: 'Fresh Produce' },
      { icon: 'ShoppingBasket', text: 'Pantry Staples' },
      { icon: 'Grape', text: 'Fruits' },
    ],
  },
  {
    id: '2',
    name: 'Puerto Galera\'s Finest',
    address: 'White Beach, Puerto Galera',
    about: 'Bringing the taste of paradise to you. We specialize in classic Filipino delicacies and sweets, perfect as souvenirs or for indulging your own cravings. Every product is made with love.',
    image: placeholderImageMap.get('store-2')!,
    rating: 4.9,
    productCount: 32,
    followers: 2500,
    lat: 13.5095,
    lng: 120.9419,
    genres: [
      { icon: 'Cake', text: 'Delicacies' },
      { icon: 'Gift', text: 'Souvenirs' },
      { icon: 'Candy', text: 'Sweets' },
    ],
  },
  {
    id: '3',
    name: 'Naujan Organics',
    address: 'Naujan Public Market',
    about: 'Committed to sustainable and organic farming. Our products are grown without harmful pesticides, ensuring healthy and delicious food for your family.',
    image: placeholderImageMap.get('store-3')!,
    rating: 4.7,
    productCount: 51,
    followers: 850,
    lat: 13.3134,
    lng: 121.3090,
    genres: [
        { icon: 'Sprout', text: 'Organic' },
        { icon: 'Carrot', text: 'Vegetables' },
        { icon: 'Heart', text: 'Healthy' },
    ],
  },
  {
    id: '4',
    name: 'Mangyan Heritage Crafts',
    address: 'Brgy. Panaytayan, Mansalay',
    about: 'Preserving the rich cultural heritage of the Mangyan people through beautiful, handcrafted goods. Each purchase supports our local artisans and their families.',
    image: placeholderImageMap.get('store-4')!,
    rating: 5.0,
    productCount: 25,
    followers: 3200,
    lat: 12.5183,
    lng: 121.3197,
    genres: [
      { icon: 'Paintbrush', text: 'Handmade' },
      { icon: 'ShoppingBag', text: 'Crafts' },
      { icon: 'Gem', text: 'Artisanal' },
    ],
  },
];


export const categories: string[] = [
  ...new Set(products.map((p) => p.category)),
];
export const brands: string[] = [...new Set(products.map((p) => p.brand))];
