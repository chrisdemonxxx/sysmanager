import { useState } from 'react';
import request from '../axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await request({ url: 'users/login', method: 'POST', data: { username, password } });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <form className="p-4 max-w-sm mx-auto" onSubmit={submit}>
      <h1 className="text-xl mb-2">Login</h1>
      <input className="border px-2 py-1 mb-2 w-full" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input type="password" className="border px-2 py-1 mb-2 w-full" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="px-3 py-1 border rounded" type="submit">Login</button>
    </form>
  );
}
