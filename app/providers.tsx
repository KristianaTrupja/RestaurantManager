"use client";

import { Provider } from "react-redux";
import ErrorBanner from "./components/globals/ErrorBanner";
import { store } from "./store/index";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
                <ErrorBanner />
                {children}
        </Provider>
    );
}