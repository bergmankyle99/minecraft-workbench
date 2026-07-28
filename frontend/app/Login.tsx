"use client";
import { resolveNaptr } from "dns";
import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import mclogo from "../public/mc-logo.png";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerPassword, setRegPassword] = useState('');
    const [registerUsername, setRegUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const validateForm = () => {
        if (!username || !password) {
            setError('Username and Password Required');
            return false;
        }
        setError('');
        return true;
    };
    const validateRegisterForm = () => {
        if (!registerUsername || !registerPassword) {
            setError('Username and Password Required');
            return false;
        }
        setError('');
        return true;
    };
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        const formDetails = new URLSearchParams();
        formDetails.append('username', username);
        formDetails.append('password', password);

        try {
            const response = await fetch("/auth/token", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formDetails,

            });
            setLoading(false);
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                router.push("/dashboard");
            } else {
                const errorData = await response.json();
                setError(errorData.detail || "Auth Failed");
            }
        } catch (error) {
            setLoading(false);
            setError('An error occurred.');
        }

    };
    const handleRegisterSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (!validateRegisterForm()) return;
        setLoading(true);
        const formDetails = new URLSearchParams();
        formDetails.append('username', registerUsername);
        formDetails.append('password', registerPassword);

        try {
            const response = await fetch("/auth/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: registerUsername,
                    password: registerPassword,
                }),

            });
            setLoading(false);
            if (response.ok) {
                alert("Registration successful, Please log in")
                setRegUsername("");
                setRegPassword("");
                router.refresh();
            } else {
                const errorData = await response.json();
                setError(errorData.detail || "Registration Failed");
            }
        } catch (error) {
            setLoading(false);
            setError('An error occurred.');
        }

    };
    return (
        <div className="logsign-page">
            <img className="logMCLogo" src={mclogo.src}></img>
            <h1 className="login-title">MINECRAFT WORKBENCH</h1>
            <p className="login-text">Minecraft Workbench is a Minecraft utility for analyzing seeds.</p>
            <br></br>
            <div className="logsign-form">
                
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Log-in</h2>
                    <br></br>
                    <div>
                        <label>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    {error &&  <div><br></br><p style={{ color: 'red' }}>{error}</p></div>}
                </form>
                
                <form className="signup-form" onSubmit={handleRegisterSubmit}>
                    <h2>Sign-up</h2>
                    <br></br>
                    <div>
                        <label>Username </label>
                        <input type="text" value={registerUsername} onChange={(e) => setRegUsername(e.target.value)} />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" value={registerPassword} onChange={(e) => setRegPassword(e.target.value)} />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                   
                    {error &&  <div><br></br><p style={{ color: 'red' }}>{error}</p></div>}
                </form>
            </div>
        </div>
        
    );

}

export default Login;
