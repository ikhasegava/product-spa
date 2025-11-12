import { create } from 'zustand';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  liked: boolean;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface ProductStore {
  products: Product[];
  cart: CartItem[];
  filter: 'all' | 'favorites';
  currentPage: number;
  itemsPerPage: number;
  priceRange: [number, number];
  selectedCategory: string;
  searchQuery: string;
  fetchProducts: () => Promise<void>;
  toggleLike: (id: number) => void;
  deleteProduct: (id: number) => void;
  setFilter: (filter: 'all' | 'favorites') => void;
  addProduct: (product: Omit<Product, 'liked'>) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  updateProduct: (id: number, updatedProduct: Partial<Product>) => void;
  setPriceRange: (range: [number, number]) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  // Корзина
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const customProducts = [
  {
    id: 1,
    title: "Мармелад жевательный кисло-сладкий из Европы халяль ассорти набор",
    description: "В этом боксе – 500 грамм отборного кисло-сладкого халяльного мармелада. Теперь каждый может быть частью банды мармеладоежек!",
    price: 965,
    image: "https://optim.tildacdn.com/stor6133-3735-4936-b234-353730373638/-/format/webp/30037389.png.webp",
    liked: false,
    category: "мармелад"
  },
  {
    id: 2,
    title: "Мармелад жевательный кисло-сладкий, ассорти бокс 500гр",
    description: "Если намечается романтик или просто настроение какое-то загадочное, то кисло-сладкий набор подойдет идеально. Твоя идеальная половинка килограмма мармелада ❤️",
    price: 1145,
    image: "https://optim.tildacdn.com/stor3264-6264-4534-b161-353737626461/-/format/webp/33102272.png.webp",
    liked: false,
    category: "мармелад"
  },
  {
    id: 3,
    title: "Мармелад жевательный кисло-сладкий халяль 200гр",
    description: "Одну упаковку халяльного мармелада себе или две следующему? Или две себе? Если станет слишком кисло, то советуем закусывать сладеньким.",
    price: 489,
    image: "https://optim.tildacdn.com/stor3066-3163-4630-a365-643061356631/-/format/webp/79039958.png.webp",
    liked: false,
    category: "мармелад"
  },
  {
    id: 4,
    title: "Мармелад жевательный кисло-сладкий и лакричный, 3шт по 100гр",
    description: "Есть 3 стула, на них сладкий, кислый и лакричный пакетик. Куда сядешь сам, куда посадишь друзей? У тебя вообще есть друзья?",
    price: 690,
    image: "https://optim.tildacdn.com/stor6233-3632-4861-a266-613434373739/-/format/webp/31794159.png.webp",
    liked: false,
    category: "лакрица"
  },
  {
    id: 5,
    title: "Мармелад жевательный кисло-сладкий, ассорти бокс 500гр",
    description: "Кисло-сладкий бокс для тех, кто не любит выбирать между кислым и сладким. ВНИМАНИЕ: после первых 100 гр наступает мармеладная зависимость и остановиться невозможно!",
    price: 980,
    image: "https://optim.tildacdn.com/stor6535-3335-4833-a134-643438373533/-/format/webp/37185981.png.webp",
    liked: false,
    category: "мармелад"
  },
  {
    id: 6,
    title: "Мармелад жевательный лакрица ассорти пачка 200гр",
    description: "Настоящий нефор мармеладного мира. Набор чертовски лакричной лакрицы, от которой немеет язык. Вы что, серьезно это хотите купить?",
    price: 485,
    image: "https://optim.tildacdn.com/stor3832-6466-4961-b633-363862653964/-/format/webp/30470783.png.webp",
    liked: false,
    category: "лакрица"
  },
  {
    id: 7,
    title: "Мармелад жевательный кисло-сладкий, ассорти бокс 1кг",
    description: "Целый килограмм мармеладного рая. Патисайз, если вы, конечно, готовы делиться. Микс кислого и сладкого вкуса – настоящий взрыв для твоих вкусовых рецепторов.",
    price: 1745,
    image: "https://optim.tildacdn.com/stor6364-6432-4436-a430-343936646462/-/format/webp/20139292.png.webp",
    liked: false,
    category: "мармелад"
  },
  {
    id: 8,
    title: "Мармелад лакричный жевательный, подарочный бокс 500гр",
    description: "А вы действительно любите страдать. Остановитесь, пока не поздно. Какое-то лакричное безумие.",
    price: 985,
    image: "https://optim.tildacdn.com/stor3335-3963-4532-a232-356637303363/-/format/webp/71905897.png.webp",
    liked: false,
    category: "лакрица"
  },
  {
    id: 9,
    title: "Мармеладные кислые ленточки с колой, 2 шт. по 100 гр",
    description: "Две упаковки по 100 грамм кисленьких ленточек с колой. Я вам всем завидую, кто это себе купит.",
    price: 440,
    image: "https://optim.tildacdn.com/stor3063-6234-4533-b437-306566653462/-/format/webp/35994306.png.webp",
    liked: false,
    category: "ленточки"
  },
  {
    id: 10,
    title: "Мармеладные кислые ленточки с малиной, 2 шт. по 100 гр",
    description: "Великолепные кислющие малиновые ленточки, да еще в двух экземплярах. Жизнь прекрасна!",
    price: 440,
    image: "https://optim.tildacdn.com/stor6435-3136-4333-b163-643535363965/-/format/webp/33867847.png.webp",
    liked: false,
    category: "ленточки"
  },
  {
    id: 11,
    title: "Вязаный Мармеладыч",
    description: "100% ручная работа Мягкий друг, который любит мармеладки также сильно, как любишь их ты :)",
    price: 2955,
    image: "https://optim.tildacdn.com/stor3630-3130-4037-b334-373637333837/-/format/webp/94686270.png.webp",
    liked: false,
    category: "мерч"
  },
  {
    id: 12,
    title: "Вязаный монтажер Леонид",
    description: "Познакомься с Леонидом. Ежедневно он, словно кит, погружается в океан мемов и креатива и поглощает в себя тонны криндже-планктона, чтобы удивлять тебя самыми неожиданными концовками и прикольчиками. Не даром пол Интернета хочет дать ему премию. Согласись, премия - это скучно. Гораздо веселее отдать честь труду монтажера, пополнив нашу коллекцию мерча его вязаной копией ;)",
    price: 2730,
    image: "https://optim.tildacdn.com/stor6464-6234-4634-b565-346530633934/-/format/webp/22875395.png.webp",
    liked: false,
    category: "мерч"
  }
];

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  cart: [],
  filter: 'all',
  currentPage: 1,
  itemsPerPage: 6,
  priceRange: [0, 3000],
  selectedCategory: 'all',
  searchQuery: '',

  fetchProducts: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ products: customProducts });
    } catch (error) {
      console.error('Failed to fetch products', error);
      set({ products: customProducts });
    }
  },

  toggleLike: (id: number) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, liked: !p.liked } : p
      ),
    })),

  deleteProduct: (id: number) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  setFilter: (filter) => set({ filter, currentPage: 1 }),

  addProduct: (product) =>
    set((state) => {
      const newId = Math.max(...state.products.map(p => p.id), 0) + 1;
      return {
        products: [...state.products, { ...product, id: newId, liked: false }],
      };
    }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setItemsPerPage: (count) => set({ itemsPerPage: count, currentPage: 1 }),

  updateProduct: (id: number, updatedProduct: Partial<Product>) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updatedProduct } : p
      ),
    })),

  setPriceRange: (range) => set({ priceRange: range, currentPage: 1 }),

  setSelectedCategory: (category) => set({ selectedCategory: category, currentPage: 1 }),

  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),

  resetFilters: () => set({ 
    priceRange: [0, 3000], 
    selectedCategory: 'all', 
    searchQuery: '',
    currentPage: 1 
  }),

  // Корзина
  addToCart: (product: Product) =>
    set((state) => {
      const existingItem = state.cart.find(item => item.product.id === product.id);
      if (existingItem) {
        return {
          cart: state.cart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          cart: [...state.cart, { product, quantity: 1 }]
        };
      }
    }),

  removeFromCart: (productId: number) =>
    set((state) => ({
      cart: state.cart.filter(item => item.product.id !== productId)
    })),

  updateCartItemQuantity: (productId: number, quantity: number) =>
    set((state) => ({
      cart: quantity === 0
        ? state.cart.filter(item => item.product.id !== productId)
        : state.cart.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
    })),

  clearCart: () => set({ cart: [] }),

  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },

  getCartItemsCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }
}));