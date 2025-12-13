"use client";

import { Provider } from "react-redux";
import { useEffect } from "react";
import ErrorBanner from "./components/globals/ErrorBanner";
import { store } from "./store/index";
import { initializeAuth } from "./store/slices/authSlice";
import { initializeCart } from "./store/slices/cartSlice";

function StoreInitializer({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        store.dispatch(initializeAuth());
        store.dispatch(initializeCart());
    }, []);
    
    return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <StoreInitializer>
                <ErrorBanner />
                {children}
            </StoreInitializer>
        </Provider>
    );
}