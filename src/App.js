import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';


function App() {
  //Email form
  const [emailForm, setEmailForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  //Result if message was sent or not
  const [result, setResult] = useState('');

  //Status of while message is being sent
  const [status, setStatus] = useState('Submit');

  //Handle Submit
  const handleSubmit = async (e) => {
    setResult('');
    e.preventDefault();
    setStatus('Sending...');

    const { name, email, message } = e.target.elements;

    let details = {
      name: name.value,
      email: email.value,
      message: message.value,
    };

    try {
      let response = await fetch('http://localhost:5000/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(details),
      });
      setStatus('Submit');
      let result = await response.json();

      if (result.status === 'success') {
        setResult('Message Sent');
        resetEmailForm();
      } else if (result.status === 'fail') {
        alert('Uh oh! Message faild to send...');
      }
    } catch (error) {
      console.error(error);
      setStatus('Submit');
      setResult('Uh oh! There was an error with submitting your message.')
    }
  };

  //Rest of JSX and form components

function resetEmailForm() {
  setEmailForm({name: '', email: '', message: ''});
}

function handleEmailFormChange() {
  setEmailForm((prevEmailData) => {
    return {
      ...prevEmailData,
      [Event.target.name]: Event.target.value,
    };
  });

  if (result.length > 0) {
    setResult('');
  }
}

  return (
    <div className='App'>
      <h1>Contact Me</h1>
      <form
      id='contact-form'
      className='contact-form'
      onSubmit={handleSubmit}
      method='POST'>
        <input
          placeholder='name*'
          type='text'
          name='name'
          required={true}
          value={emailForm.name}
          onChange={handleEmailFormChange}
        />
        <input
          placeholder='email-address*'
          type='email'
          name='email'
          requires={true}
          value={emailForm.email}
          onChange={handleEmailFormChange}
        />
        <textarea
          maxLength={300}
          placeholder='message (max 300 characters)*'
          name='message'
          required={true}
          value={emailForm.message}
          onChange={handleEmailFormChange}
          />
        <button type="submit">{status}</button>
        <h3>{result}</h3>
      </form>
    </div>
  );
}

export default App;
