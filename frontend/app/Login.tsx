"use client";
import { resolveNaptr } from "dns";
import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import mclogo from "../public/mc-logo.png";
import MinecraftButton from "./components/MinecraftButton";

function Login() {
    //Form stateful variables
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerPassword, setRegPassword] = useState('');
    const [registerUsername, setRegUsername] = useState('');
    //Error stateful variable for holding error messages and displaying them
    const [error, setError] = useState('');
    //Loading state
    const [loading, setLoading] = useState(false);

    //use router creates router variable for navigating through the app router of next.js
    const router = useRouter();
    //if theres no user name or password set error, return false
    const validateForm = () => {
        if (!username || !password) {
            setError('Username and Password Required');
            return false;
        }
        //otherwise set error to none and return true (valid form)
        setError('');
        return true;
    };
    // same as above for register form
    const validateRegisterForm = () => {
        if (!registerUsername || !registerPassword) {
            setError('Username and Password Required');
            return false;
        }
        setError('');
        return true;
    };
    //handle submit of login form
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        //validate form
        if (!validateForm()) return;
        // if valid set form to true or valid
        setLoading(true);
        //append username and password to form details JSON
        const formDetails = new URLSearchParams();
        formDetails.append('username', username);
        formDetails.append('password', password);

        //try to request token from /auth/token by posting form details
        try {
            const response = await fetch("/auth/token", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formDetails,

            });
            setLoading(false);
            //if repsonse okay get json contining token, assign to local storage and nav to dashboard
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                router.push("/dashboard");
            } else {
                //if not okay display response in the error section
                const errorData = await response.json();
                setError(errorData.detail || "Auth Failed");
            }
        } catch (error) {
            //if an error is caught, stop loading and set error
            setLoading(false);
            setError('An error occurred.');
        }

    };
    //mostly same as above
    const handleRegisterSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (!validateRegisterForm()) return;
        setLoading(true);
        const formDetails = new URLSearchParams();
        formDetails.append('username', registerUsername);
        formDetails.append('password', registerPassword);

        //try to register user using /auth/ endpoint with username and password as a json string
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
                    <MinecraftButton
                        text={loading ? "Logging in..." : "Login"}
                        type="submit"
                        disabled={loading}
                    />
                    {error && <div><br></br><p style={{ color: 'red' }}>{error}</p></div>}
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
                    <MinecraftButton
                        // if loading say "signing up", if not, say sign up
                        text={loading ? "Signing up..." : "Sign Up"}
                        type="submit"
                        disabled={loading}
                    />

                    {error && <div><br></br><p style={{ color: 'red' }}>{error}</p></div>}
                </form>
            </div>
        </div>

    );

}

export default Login;
