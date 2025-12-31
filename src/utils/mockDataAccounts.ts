export interface Account {
  id: number;
  bankName?: string;
  cardNumber: string;
  type: "card" | "bank";
}

export const MOCK_ACCOUNTS: Account[] = [
  { id: 1, bankName: "VISA", cardNumber: "**** **** **** 1234", type: "card" },
  { id: 2, cardNumber: "1900 8988 5456", type: "bank" },
  { id: 3, cardNumber: "1900 8112 5222", type: "bank" },
  { id: 4, cardNumber: "4411 0000 1234", type: "bank" },
];

export const PRESET_AMOUNTS = [10, 50, 100, 150, 200, 1000];
