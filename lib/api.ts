import { MenuItem } from '@/types/item';

const API_URL = 'https://fakestoreapi.com/products?limit=12';

const fallbackItems: MenuItem[] = [
  {
    id: '1',
    title: 'Greek Salad',
    description: 'Fresh cucumber, tomato, olive, and feta served with lemon dressing.',
    price: 9.99,
    category: 'Salad',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800',
  },
  {
    id: '2',
    title: 'Bruschetta',
    description: 'Toasted bread with tomato, garlic, basil, and extra-virgin olive oil.',
    price: 6.49,
    category: 'Appetizer',
    image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=800',
  },
  {
    id: '3',
    title: 'Lemon Dessert',
    description: 'House lemon cake served with whipped mascarpone cream.',
    price: 5.25,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800',
  },
];

type ApiProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

export async function fetchMenuItems(): Promise<MenuItem[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`API request failed with ${response.status}`);
    }

    const products = (await response.json()) as ApiProduct[];
    return products.map((product) => ({
      id: String(product.id),
      title: product.title,
      description: product.description,
      price: Number(product.price),
      category: product.category,
      image: product.image,
    }));
  } catch {
    return fallbackItems;
  }
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  const items = await fetchMenuItems();
  return items.find((item) => item.id === id) ?? null;
}
