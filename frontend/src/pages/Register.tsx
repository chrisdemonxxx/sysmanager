import { useState } from 'react';
import request from '../axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request({ url: 'users/register', method: 'POST', data: { username, password } });
      navigate('/login');
    } catch (err) {
      alert('Register failed');
    }
  };

  return (
    <form className="p-4 max-w-sm mx-auto" onSubmit={submit}>
      <h1 className="text-xl mb-2">Register</h1>
      <input className="border px-2 py-1 mb-2 w-full" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input type="password" className="border px-2 py-1 mb-2 w-full" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="px-3 py-1 border rounded" type="submit">Register</button>
    </form>
  );
}
