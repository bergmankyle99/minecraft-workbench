"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            console.log(token);
            if (!token) {
                router.push("/");
                return;
            }
            try {
                const response = await fetch(`http://localhost:8000/auth/verify-token/${token}`)
                if (!response.ok) {
                    throw Error('Token verification failed');
                }
                setLoading(false);
            } catch (error) {
                localStorage.removeItem('token');
                router.replace("/");;
            }
        }
        verifyToken();
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }
    return (

        <div>
            { }
            <nav>
                Minecraft Workbench
            </nav>

            {children}
        </div>
    );
}