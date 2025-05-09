export interface PedidosInfos {
    pedidos_Infos: PedidoInfo;
  }
  
  export interface PedidoInfo {
    pedidos: Pedido;
    produtos: Produto;
    users: Usuario;
  }
  
  export interface Pedido {
    id_Pedido: number;
    curso: string;
    vl_prod_unidade: number;
    qnt_prod_unidade: number;
    transaction_id: number;
    data_pedido: string; // formato ISO, você pode usar `Date` se for convertido
    checkout: StatusPedido;
  }
  
  export interface Produto {
    id_produto: string;
    nome: string;
    img: string;
  }
  
  export interface Usuario {
    id_user: string;
    nome: string;
    ra: string;
    telefone:string;
  }
  
  export enum StatusPedido {
    Pendente = 1, 
    Retirado = 2
}