import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('CRITICAL UI CRASH:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white p-8 font-mono flex flex-col items-center justify-center text-center">
                    <div className="border-4 border-red-600 p-8 max-w-2xl bg-red-900/20">
                        <h1 className="text-4xl text-red-500 mb-6 blink">!!! SISTEM HATASI !!!</h1>
                        <p className="text-xl mb-4 text-yellow-400">UYGULAMA BEKLENMEDIK BIR HATA ILE KARSILASTI.</p>
                        <div className="bg-black p-4 text-left border border-neutral-700 mb-6 overflow-auto max-h-48">
                            <code className="text-sm text-red-400">
                                {this.state.error?.toString()}
                            </code>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-white text-black px-6 py-3 font-bold hover:bg-yellow-400 transition-colors"
                        >
                            [ SAYFAYI YENILE ]
                        </button>
                        <p className="mt-6 text-neutral-500 text-sm">
                            SORUN DEVAM EDERSE LUTFEN ADMINE BILDIRINIZ.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
