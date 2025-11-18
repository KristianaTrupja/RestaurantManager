"use client";

import { useDispatch, useSelector } from "react-redux";
import { clearError } from "@/app/store/slices/errorSlice";

export default function ErrorBanner(){

    const error = useSelector((state: any) => state.errors.message);
    const dispatch = useDispatch();
    if(!error) return null;
    return(
        <div className="bg-red-600 text-white p-3 text-center">
            {error}
            <button onClick={() => dispatch(clearError())} className="ml-4 underline">Close</button>
        </div>
    )
}