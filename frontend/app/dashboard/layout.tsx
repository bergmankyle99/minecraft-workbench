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
    //on page load, verify the token in localstorage by getting the response of the current token
    //check. if its valid it will return ok response, if not navigate back to login page
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

    //to logout, remove token and return to login page or /
    function logout (){
        localStorage.removeItem("token");
        router.replace("/");
    }
    return (

        <div>
            { }
            <div className="bg-image"></div>
            <div className="top-bar">
                <img src={mclogo.src}></img>
                <h1>MINECRAFT WORKBENCH</h1>
            </div>
            
            <div className="body">
                <div className="side-bar">
                    <ul className="mc-ul">
                        {/* on click navigate to the page */}
                        <li onClick={() => router.push("/dashboard")}><MinecraftButton text={"Structure Finder"} ></MinecraftButton></li> 
                    </ul>
                    <ul className="mc-ul">
                        {/* on click navigate to the page */}
                        <li onClick={() => router.push("/dashboard/biome-finder")}><MinecraftButton text={"Biome Finder"}></MinecraftButton></li> 
                    </ul>
                    <ul className="side-logout">
                        {/* on click remove token with logout and navigate to the page */}
                        <li onClick={logout}><MinecraftButton text={"Log out"} ></MinecraftButton></li>
                    </ul>
                </div>
                {/* children means contain same level page.tsx and subpages (e.g. biome-finder/page.tsx) within the dashbaord layout
                    this allows the layout to do all the validation only once and we dont need to validate on each page request
                */}
                <div className="main">
                    {children}
                </div> 
            </div>
            
        </div>
    );
}
