'use client';

import { PiAuth, PiPayment, PiShare } from '@/components';
import { AuthResult } from '@/types/pi-sdk';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    console.log('=== Pi Payment Section Loaded on Front Page ===');
  }, []);

  // Set up visible console log panel
  useEffect(() => {
    const consoleDiv = document.getElementById('pi-payment-console');
    if (!consoleDiv) return;

    // Store original console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    // Create log entry function
    const addLogEntry = (type: 'log' | 'error' | 'warn', message: string) => {
      if (!consoleDiv) return;
      
      const now = new Date().toLocaleTimeString();
      const entry = document.createElement('div');
      entry.className = `mb-1 ${type === 'error' ? 'text-red-400' : type === 'warn' ? 'text-yellow-400' : 'text-green-400'}`;
      entry.innerHTML = `<span class="text-gray-500 mr-2">[${now}]</span><span class="font-mono">${message}</span>`;
      
      // Add to top of console div
      consoleDiv.insertBefore(entry, consoleDiv.firstChild);
      
      // Limit to last 50 entries
      if (consoleDiv.children.length > 50) {
        consoleDiv.removeChild(consoleDiv.lastChild!);
      }
    };

    // Override console methods to capture Pi Payment logs
    console.log = (...args: any[]) => {
      // Only capture Pi Payment related logs
      const firstArg = args[0];
      if (typeof firstArg === 'string' && firstArg.includes('Pi Payment Section')) {
        const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
        addLogEntry('log', message);
      }
      originalLog(...args);
    };

    console.error = (...args: any[]) => {
      const firstArg = args[0];
      if (typeof firstArg === 'string' && firstArg.includes('Pi Payment Section')) {
        const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
        addLogEntry('error', message);
      }
      originalError(...args);
    };

    console.warn = (...args: any[]) => {
      const firstArg = args[0];
      if (typeof firstArg === 'string' && firstArg.includes('Pi Payment Section')) {
        const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
        addLogEntry('warn', message);
      }
      originalWarn(...args);
    };

    // Cleanup function
    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);
  const handleAuthSuccess = (result: AuthResult) => {
    console.log('Authentication successful:', result);
    // Handle successful authentication (e.g., store user data, redirect)
  };

  const handleAuthError = (error: Error) => {
    console.error('Authentication failed:', error);
    // Handle authentication error
  };

  const handlePaymentSuccess = (paymentId: string, txid: string) => {
    console.log('=== Pi Payment Section: Payment Successful ===');
    console.log('Payment ID:', paymentId);
    console.log('Transaction ID:', txid);
    // Handle successful payment
  };

  const handlePaymentError = (error: Error) => {
    console.error('=== Pi Payment Section: Payment Failed ===');
    console.error('Error:', error);
    // Handle payment error
  };

  const handlePaymentCancelled = () => {
    console.log('=== Pi Payment Section: Payment Cancelled by User ===');
    // Handle cancelled payment
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-600 flex-shrink-0">
                              <img src="/logo.jpg" alt="Pi Logo" className="w-full h-full object-cover" />
                            </div>
              <h1 className="text-xl font-bold text-gray-900">Pi App</h1>
            </div>
            <PiShare 
              title="Check out Pi App!"
              message="I found this amazing Pi Network app. Join me!"
              buttonText="Share"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Pi App
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the power of Pi Network integration. Authenticate with your Pi account, 
            make payments, and interact with the Pi ecosystem.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Authentication Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pi Authentication</h3>
            <p className="text-gray-600 mb-4">
              Securely sign in with your Pi Network account and access user information.
            </p>
            <PiAuth 
              onAuthSuccess={handleAuthSuccess}
              onAuthError={handleAuthError}
            />
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pi Payments</h3>
            <p className="text-gray-600 mb-4">
              Accept Pi cryptocurrency payments from users with secure transactions.
            </p>
            <PiPayment
              amount={0.01}
              memo="Demo payment for Pi App"
              metadata={{ product: 'demo', category: 'test' }}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              onPaymentCancelled={handlePaymentCancelled}
            />
            {/* Visible Pi Payment Console Log Panel */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Pi Payment Console Logs
              </h4>
              <div id="pi-payment-console" className="text-sm font-mono h-32 overflow-y-auto bg-black text-green-400 p-3 rounded">
                <div className="text-gray-400">[Pi Payment logs will appear here...]</div>
              </div>
            </div>
            {/* Console log for front page Pi Payment section */}
            <script dangerouslySetInnerHTML={{ __html: "console.log('=== Pi Payment Section Loaded on Front Page ===');" }} />
          </div>

          {/* Features Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                User Authentication
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                U2A Payments
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                A2U Payments
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Social Sharing
              </li>
            </ul>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h3>
          <div className="prose text-gray-600 max-w-none">
            <p className="mb-4">
              This is a demo application showcasing Pi Network SDK integration. To use this app:
            </p>
            <ol className="list-decimal list-inside space-y-2 mb-6">
              <li>Open this app in the Pi Browser for the best experience</li>
              <li>Click &quot;Sign in with Pi&quot; to authenticate</li>
              <li>Try making a test payment</li>
              <li>Share the app with other pioneers</li>
            </ol>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Make sure to configure your API keys in the environment variables 
                before deploying to production. See the <code>.env.example</code> file for reference.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Built with Next.js and Pi Network SDK. Deployed on Vercel.
          </p>
        </div>
      </footer>
    </main>
  );
}
