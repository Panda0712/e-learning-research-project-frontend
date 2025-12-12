export interface Transaction {
    id: string;
    studentName: string;
    studentEmail: string;
    courseTitle: string;
    instructorName: string;
    amount: number;
    payoutMethod: string; 
    date: string;
    status: 'Successful' | 'Refunded' | 'Failed';
    
    // Chi tiết cho Modal (Popup)
    bankRef?: string;
    subtotal?: number;
    discount?: number;
    discountCode?: string;
    paymentMethodDetail?: string; 
}