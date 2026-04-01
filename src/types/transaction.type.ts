export interface TransactionItem {
  courseId: number;
  courseTitle: string;
  instructorName: string;
  discountAmount: number;
  discountCode: string | null;
}

export interface Transaction {
  id: number;
  userId: number;
  userEmail: string;
  userFullName: string;
  amount: number;
  paymentMethod: string;
  status: string;
  gatewayReference: string;
  createdAt: string;
  items: TransactionItem[];
}