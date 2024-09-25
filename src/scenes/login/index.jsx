import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/login', { username, password });
            const token = response.data.token;

            // Lưu token vào localStorage
            Cookies.set('token', token, { expires: 1 }); // Hết hạn sau 1 ngày

            console.log('Login successful!', token);
        } catch (err) {
            setError('Invalid username or password');
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
