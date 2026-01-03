// src/app/providers.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';

// Web3 Context
interface Web3ContextType {
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  isConnecting: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      console.warn('MetaMask is not installed');
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[];
      
      setIsConnected(accounts.length > 0);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (typeof window.ethereum === 'undefined') {
        return;
      }

      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        }) as string[];
        
        setIsConnected(accounts.length > 0);
      } catch (error: any) {
        // Ignorar el error de "wallet must have at least one account"
        if (error?.code !== 4001) {
          console.error('Error checking wallet connection:', error);
        }
        setIsConnected(false);
      }
    };

    checkIfWalletIsConnected();

    // Escuchar cambios en las cuentas
    const handleAccountsChanged = (accounts: string[]) => {
      setIsConnected(accounts.length > 0);
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={{ 
      isConnected, 
      connectWallet,
      isConnecting 
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

// Main Providers component that wraps all providers
export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Web3Provider>
        {children}
      </Web3Provider>
    </AuthProvider>
  );
}