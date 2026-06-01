// Pi Network SDK Type Definitions

declare global {
  interface Window {
    Pi: PiSDK;
  }
}

export interface PiSDK {
  init(config: PiInitConfig): Promise<void>;
  authenticate(scopes: Scope[], onIncompletePaymentFound?: (payment: PaymentDTO) => void): Promise<AuthResult>;
  createPayment(paymentData: PaymentData, callbacks: PaymentCallbacks): void;
  openShareDialog(title: string, message: string): void;
}

export interface PiInitConfig {
  version: string;
  sandbox?: boolean;
}

export type Scope = 'username' | 'payments' | 'wallet_address';

export interface AuthResult {
  user: PiUser;
  accessToken: string;
}

export interface PiUser {
  uid: string;
  username: string;
}

export interface PaymentData {
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
  uid?: string;
}

export interface PaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void | Promise<void>;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void | Promise<void>;
  onCancel: (paymentId: string) => void;
  onError: (paymentId: string, error: Error) => void;
}

export interface PaymentDTO {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
  from_address?: string;
  to_address?: string;
  direction: 'user_to_app' | 'app_to_user';
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  transaction?: {
    txid: string;
    verified: boolean;
  };
  created_at: string;
  approved_at?: string;
  completed_at?: string;
}

export interface A2UPaymentRequest {
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
  uid: string;
}

export interface A2UPaymentResponse {
  identifier: string;
  recipient: string;
  amount: number;
  memo: string;
  status: string;
}
