import { create } from 'zustand';

interface ProdutoState {
  produto: string | null;
  setProduto: (produto: string) => void;
  clearProduto: () => void;
}

export const useProdutoStore = create<ProdutoState>((set) => ({
  produto: null,
  setProduto: (produto) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('produto', produto);  // Salva no localStorage apenas no cliente
    }
    set({ produto });
  },
  clearProduto: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('produto');  // Remove do localStorage apenas no cliente
    }
    set({ produto: null });
  },
}));
