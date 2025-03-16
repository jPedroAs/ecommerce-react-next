import { Product } from "./ProdutoInterface";

export interface Pedido {
    id_pedido: number,
    id_produto: string,
    vl_prod_unidade: number,
    qnt_prod_unidade: number,
    status_pedido: StatusPedido,
    id_category: number,
    transaction_id: number,
    id_aluno: string
}

export interface Pedidos {
    pedidos: Pedido,
    produtos: Product,
}



export enum StatusPedido {
    Carrinho = 0, 
    Pedido_Fec = 1,
    Efetivado = 2
}

export { Product };
