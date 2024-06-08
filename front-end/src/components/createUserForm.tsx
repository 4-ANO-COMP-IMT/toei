import React, { useState } from 'react';
import axios from 'axios';

const CreateUserForm: React.FC = () => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/user/create', {
        name,
        birthDate,
        login,
        password,
        email,
      });

      if (response.status === 201) { // pegar pelo status ou por outra coisa 
        alert('User created successfully!');
        setName('');
        setBirthDate('');
        setLogin('');
        setPassword('');
        setEmail('');
      } else {
        alert('Failed to create user');
      }
    } catch (error) {
      console.error('There was an error creating the user!', error);
      alert('Failed to create user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Birth Date:</label> 
        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
      </div>
      <div>
        <label>Login:</label>
        <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <button type="submit">Create User</button>
    </form>
  );
};

export default CreateUserForm; // pega no app todos q nos fizermos 
