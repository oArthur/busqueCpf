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

export interface ICardPack {
  id: number,
  isMostPopular: boolean,
  title: string,
  subtitle: string,
  value: number,
  price: number,
  description: any,
  buttonLabel: string
}
