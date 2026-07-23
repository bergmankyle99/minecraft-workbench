"use client";
import { canNewFetchStrategyProvideMoreContent } from "next/dist/client/components/segment-cache/cache";
import { verify } from "node:crypto";
import React,{ useEffect, useState } from "react";
import { useRouter } from "next/navigation";
function ProtectedPage(){
    const router = useRouter();
    useEffect(()=>{
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            console.log(token);
            try {
                const response = await fetch (`http://localhost:8000/auth/verify-token/${token}`)
                if(!response.ok){
                    throw Error('Token verification failed');
                }
            }catch(error){
                localStorage.removeItem('token');
                router.push("/");;
            }
        }
        verifyToken();
    }, []);
    return <div>This is a protected page. only visible to authenticated users</div>
}
export default ProtectedPage;