import React, { useState, useEffect } from "react";
import { registation, login } from "./authLogic";

const AuthPanel = ({ setIsAuthorized, setIsPanelVisible, setUserData }) => {
    const [isLogin, setIsLogin] = useState(true);

    const handleLogin = async (e) => {
        e.preventDefault(); // предотвращаем перезагрузку страницы
        const request = await login({ email: e.target[0].value , password: e.target[1].value });

        if (request) {
            setIsAuthorized(true);
            setIsPanelVisible(false);
            setUserData(request);
        } else {
            console.log("Error while login");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault(); // предотвращаем перезагрузку страницы
        const request = await registation({ name: e.target[0].value , email: e.target[1].value, password: e.target[2].value });

        if (request) {
            setIsAuthorized(true);
            setIsPanelVisible(false);
            setUserData(request);
        } else {
            console.log("Error while registration");
        }
    };

    useEffect(() => {
        document.body.classList.add("no-scroll");

        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, []);

    return (
        <div className="auth-panel-overlay">
            <div className="auth-panel-content">
                <div className="box p-6 gap-3">
                <button className="close-button" onClick={() => setIsPanelVisible(false)}>✖️</button>
                    {isLogin ? (
                        <form onSubmit={handleLogin}>
                            <h1 className="title mb-6">Login</h1>
                            <div className="field">
                                <label className="label">Email</label>
                                <div className="control">
                                    <input className="input" type="email" placeholder="Enter your email" required />
                                </div>
                            </div>
                            <div className="field mb-6">
                                <label className="label">Password</label>
                                <div className="control">
                                    <input className="input" type="password" placeholder="Enter your password" required />
                                </div>
                            </div>
                            <div className="field">
                                <button className="button is-primary" type="submit">Login</button>
                            </div>
                            <p>
                                Don't have an account?{" "}
                                <a href="#" onClick={() => setIsLogin(false)}>
                                    Register here
                                </a>.
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister}>
                            <h1 className="title mb-6">Register</h1>
                            <div className="field">
                                <label className="label">Name</label>
                                <div className="control">
                                    <input className="input" type="text" placeholder="Enter your name" required />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Email</label>
                                <div className="control">
                                    <input className="input" type="email" placeholder="Enter your email" required />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Password</label>
                                <div className="control">
                                    <input className="input" type="password" placeholder="Enter your password" required />
                                </div>
                            </div>
                            <div className="field mb-6">
                                <label className="label">Confirm Password</label>
                                <div className="control">
                                    <input className="input" type="password" placeholder="Confirm your password" required />
                                </div>
                            </div>
                            <div className="field">
                                <button className="button is-primary" type="submit">Register</button>
                            </div>
                            <p>
                                Already have an account?{" "}
                                <a href="#" onClick={() => setIsLogin(true)}>
                                    Login here
                                </a>.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(AuthPanel);