export interface Product {
    id: string;
    nome: string;
    preco: number;
    img: string;
    descricao: string;
    quantidade: number;
    TipoMovimento: string;
    onClose: () => void;
}