
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
  lowStock?: boolean;
};

export type Store = {
  id: string;
  name: string;
  address: string;
  image: {
    src: string;
    hint: string;
  };
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
    brand: 'Mindoro Harvest',
    onSale: true,
  },
  {
    id: '2',
    name: 'Organic Rambutan (1kg)',
    description: 'Juicy and sweet rambutan, grown without pesticides. A local favorite seasonal fruit.',
    price: 120,
    image: placeholderImageMap.get('2')!,
    category: 'Fresh Produce',
    brand: 'Naujan Farms',
  },
  {
    id: '3',
    name: 'Wild Honey (500ml)',
    description: 'Pure, raw honey harvested from the forests of Mount Halcon. Rich in flavor and nutrients.',
    price: 350,
    image: placeholderImageMap.get('3')!,
    category: 'Local Delicacies',
    brand: 'Mangyan Treasures',
    lowStock: true,
  },
  {
    id: '4',
    name: 'Handwoven Nito Basket',
    description: 'A beautifully crafted basket made from native Nito vines by local artisans.',
    price: 550,
    image: placeholderImageMap.get('4')!,
    category: 'Handicrafts',
    brand: 'Mangyan Treasures',
  },
  {
    id: '5',
    name: 'Dried Fish (Tuyo)',
    description: 'Salty and savory dried fish, a staple in Filipino breakfast. Sourced from the coastal towns of Mindoro.',
    price: 150,
    image: placeholderImageMap.get('5')!,
    category: 'Local Delicacies',
    brand: 'Mindoro Harvest',
    onSale: true,
    lowStock: true,
  },
  {
    id: '6',
    name: 'Banana Chips (250g)',
    description: 'Crispy and sweet banana chips made from Mindoro saba bananas. A perfect snack.',
    price: 100,
    image: placeholderImageMap.get('6')!,
    category: 'Local Delicacies',
    brand: 'Naujan Farms',
  },
  {
    id: '7',
    name: 'Mindoro Cashew Nuts (500g)',
    description: 'Roasted cashew nuts from the hills of Mindoro. A healthy and delicious treat.',
    price: 400,
    image: placeholderImageMap.get('7')!,
    category: 'Local Delicacies',
    brand: 'Mindoro Harvest',
  },
  {
    id: '8',
    name: 'Tablea Cacao Balls',
    description: 'Pure, unsweetened cacao balls for making rich, traditional hot chocolate.',
    price: 200,
    image: placeholderImageMap.get('8')!,
    category: 'Local Delicacies',
    brand: 'Naujan Farms',
  },
  {
    id: '9',
    name: 'Buri Palm Bag',
    description: 'A stylish and durable shoulder bag handwoven from Buri palm leaves.',
    price: 450,
    image: placeholderImageMap.get('9')!,
    category: 'Handicrafts',
    brand: 'Mangyan Treasures',
  },
  {
    id: '10',
    name: 'Fresh Mangoes (1kg)',
    description: 'Sweet, golden mangoes, the pride of the Philippines, from sunny Mindoro fields.',
    price: 180,
    image: placeholderImageMap.get('10')!,
    category: 'Fresh Produce',
    brand: 'Mindoro Harvest',
  },
  {
    id: '11',
    name: 'Coconut Vinegar (750ml)',
    description: 'Organic, fermented coconut vinegar. Adds a sharp, delicious tang to any dish.',
    price: 90,
    image: placeholderImageMap.get('11')!,
    category: 'Pantry Staples',
    brand: 'Naujan Farms',
  },
  {
    id: '12',
    name: 'Lanzones (1kg)',
    description: 'Sweet and succulent Lanzones, a seasonal delight from local orchards.',
    price: 150,
    image: placeholderImageMap.get('12')!,
    category: 'Fresh Produce',
    brand: 'Mindoro Harvest',
  },
   {
    id: '13',
    name: 'Suman sa Lihia',
    description: 'A local delicacy of steamed glutinous rice wrapped in banana leaves.',
    price: 120,
    image: placeholderImageMap.get('13')!,
    category: 'Local Delicacies',
    brand: 'Calapan Sweets',
  },
  {
    id: '14',
    name: 'Barako Coffee Beans (250g)',
    description: 'Strong, aromatic Barako coffee beans, grown in the highlands of Mindoro.',
    price: 250,
    image: placeholderImageMap.get('14')!,
    category: 'Pantry Staples',
    brand: 'Mindoro Harvest',
  },
  {
    id: '15',
    name: 'Homemade Ube Jam (250g)',
    description: 'Rich and creamy purple yam jam, a classic Filipino dessert spread.',
    price: 180,
    image: placeholderImageMap.get('15')!,
    category: 'Local Delicacies',
    brand: 'Calapan Sweets',
  },
  {
    id: '16',
    name: 'Sweet Tamarind Candy',
    description: 'A sweet and sour treat made from local tamarind pulp.',
    price: 70,
    image: placeholderImageMap.get('16')!,
    category: 'Local Delicacies',
    brand: 'Naujan Farms',
    onSale: true,
  },
  {
    id: '17',
    name: 'Hand-painted Bayong Bag',
    description: 'A traditional Filipino woven bag, hand-painted with unique local designs.',
    price: 600,
    image: placeholderImageMap.get('17')!,
    category: 'Handicrafts',
    brand: 'Mangyan Treasures',
  }
];

export const stores: Store[] = [
  {
    id: '1',
    name: 'Calapan Agri-Hub',
    address: 'Central Market, Calapan City',
    image: placeholderImageMap.get('store-1')!,
  },
  {
    id: '2',
    name: 'Puerto Galera\'s Finest',
    address: 'White Beach, Puerto Galera',
    image: placeholderImageMap.get('store-2')!,
  },
  {
    id: '3',
    name: 'Naujan Organics',
    address: 'Naujan Public Market',
    image: placeholderImageMap.get('store-3')!,
  },
  {
    id: '4',
    name: 'Mangyan Heritage Crafts',
    address: 'Brgy. Panaytayan, Mansalay',
    image: placeholderImageMap.get('store-4')!,
  },
];


export const categories: string[] = [
  ...new Set(products.map((p) => p.category)),
];
export const brands: string[] = [...new Set(products.map((p) => p.brand))];
