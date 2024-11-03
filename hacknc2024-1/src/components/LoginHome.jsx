import React, { useState, useEffect } from 'react';
import './LoginHome.css'

function LoginHome() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log(data.message || data.error); // Log the response
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
            <div className="wrapper">
              <div className="card-switch">
                <label className="switch">
                  <input type="checkbox" className="toggle" />
                  <span className="slider"></span>
                  <span className="card-side"></span>
                        <div className="flip-card__inner">
                            <div className="flip-card__front">
                                <div className="title">Log in</div>
                                <form className="flip-card__form" action="">
                                    <input className="flip-card__input" name="email" placeholder="Email" type="email" />
                                    <input className="flip-card__input" name="password" placeholder="Password" type="password" />
                                    <button className="flip-card__btn">Lets go!</button>
                                </form>
                            </div>
                            <div className="flip-card__back">
                              <div className="title">Sign up</div>
                              <form className="flip-card__form" action="">
                                <input className="flip-card__input" placeholder="Name" type="name" />
                                <input className="flip-card__input" name="email" placeholder="Email" type="email" />
                                <input className="flip-card__input" name="password" placeholder="Password" type="password" />
                                <button className="flip-card__btn">Confirm!</button>
                            </form>
                        </div> 
                    </div>
                </label>
            </div>
        </div>
    );
}

export default LoginHome;