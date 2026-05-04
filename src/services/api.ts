export interface Quote {
  content: string;
  author: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  iconKey: string;
}

const CATEGORIES: Category[] = [
  { id: 1, name: 'Trabalho', slug: 'trabalho', iconKey: 'briefcase' },
  { id: 2, name: 'Estudos', slug: 'estudos', iconKey: 'book' },
  { id: 3, name: 'Saúde', slug: 'saude', iconKey: 'activity' },
  { id: 4, name: 'Pessoal', slug: 'pessoal', iconKey: 'user' },
  { id: 5, name: 'Finanças', slug: 'financas', iconKey: 'dollar' },
  { id: 6, name: 'Lazer', slug: 'lazer', iconKey: 'game' },
  { id: 7, name: 'Compras', slug: 'compras', iconKey: 'shopping' },
  { id: 8, name: 'Outros', slug: 'outros', iconKey: 'grid' },
];


export async function fetchQuote(): Promise<Quote> {
  const response = await fetch('https://dummyjson.com/quotes/random');
  if (!response.ok) throw new Error('Falha ao buscar frase');
  const data = await response.json() as { quote: string; author: string };
  return { content: data.quote, author: data.author };
}

export async function fetchCategories(): Promise<Category[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return CATEGORIES;
}
