export interface Popup {
    h1: string;
    img: string;
    nome: string;
    valor: string;
    file: string;
    descricao: string;
    quantidade: string;
    type: string;
    motivo: string;
    btn1: string;
    btn2: string;
  }
  export interface BlueBlock {
    h1: string;
    p: string;
    btn: string;
    move: boolean;
    onButtonClick: () => void;
  }
  export interface FormBlock {
    h1: string;
    btn: string;
    move: boolean;
    onButtonClick: () => void;
    showAllFields: boolean;
    formHeight: string;
  }

  export type User = {
    ID: string;
    email: string;
    exp: number;
    given_name: string;
    iat: number;
    name: string;
    nbf: number;
    role: string;
  }

  export interface Product {
    id: string;
    nome: string;
    preco: number;
    img: string;
    categoria: string;
    descricao: string;
    quantidade: number;
    qAval: string;
    onClose: () => void;
}

export interface ResetPassword {
  Email: string;
  ResetCode: string;
  NewPassword: string;
}