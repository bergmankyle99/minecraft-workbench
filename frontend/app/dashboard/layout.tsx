"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";
import mclogo from "../../public/mc-logo.png"
import MinecraftButton from "../components/MinecraftButton";
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
                const response = await fetch(`/auth/verify-token/${token}`)
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

    function logout (){
        localStorage.removeItem("token");
        router.replace("/");
    }
    return (

        <div>
            { }
            <div className="top-bar">
                <img src={mclogo.src}></img>
                <h1>MINECRAFT WORKBENCH</h1>
            </div>
            <div className="body">
                <div className="side-bar">
                    <ul className="">
                        <li onClick={() => router.push("/dashboard")}><MinecraftButton text={"Structure Finder"} ></MinecraftButton></li> 
                    </ul>
                    <br></br>
                    <ul className="">
                        <li onClick={() => router.push("/dashboard/biome-finder")}><MinecraftButton text={"Biome Finder"}></MinecraftButton></li> 
                    </ul>
                    <ul className="side-logout">
                        <li onClick={logout}><MinecraftButton text={"Log out"} ></MinecraftButton></li>
                    </ul>
                </div>
                <div className="main">
                    {children}
                </div> 
            </div>
            
        </div>
    );
}
