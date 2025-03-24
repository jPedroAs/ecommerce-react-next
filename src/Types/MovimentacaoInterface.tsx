export interface Movimentacao {
    idProduto: string;
    Produto: string;
    QTD: number;
    Descricao: string;
    onClose: () => void;
}