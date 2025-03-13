export interface CupomResponse {
  cupom: {
    exists: boolean;
    name: string;
    discount: number;
    description: string;
  };
}

export interface Iuser {
  nome: string,
  email: string,
  document: string,
  telefone: string
}
