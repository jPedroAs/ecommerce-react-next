export interface Divisor  {
    h1: string;
    p: string; // A interrogação indica que a propriedade é opcional
    btn: string;
    onClick?: () => void; // Adicione a propriedade onClick
    /*color: string; */
  }

  export interface Product {
    id: string;
    nome: string;
    preco: number;
    img: string;
    descricao: string,
    quantidade: number
}

export interface Users{
  id: string,      
  name: string,   
  email: string,    
  senha: string,   
  ra: string,       
  telefone: string, 
  role: string,     
  cep: string,      
  rua: string,    
  bairro: string,  
  cidade: string,   
  estado: string,   
  numero: string
}   