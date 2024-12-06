import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [captionForm, setCaptionForm] = useState({
    title: '',
    story: '',
    visitedLocation: '',
    imageUrl: '',
    visitedDate: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptionChange = (e) => {
    setCaptionForm({ ...captionForm, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${API_URL}/image-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setCaptionForm({ ...captionForm, imageUrl: response.data.imageUrl });
    } catch (error) {
      console.error('Image upload error:', error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/login' : '/create-account';
      const response = await axios.post(`${API_URL}${endpoint}`, formData);
      
      setToken(response.data.accessToken);
      setUser(response.data.user);
      
      if (!isLogin) {
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert(error.response?.data?.message || 'Authentication failed');
    }
  };

  const fetchCaptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-caption`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCaptions(response.data.stories);
    } catch (error) {
      console.error('Fetch captions error:', error);
    }
  };

  const createCaption = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/caption`, captionForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCaptions();
      setCaptionForm({
        title: '',
        story: '',
        visitedLocation: '',
        imageUrl: '',
        visitedDate: ''
      });
    } catch (error) {
      console.error('Create caption error:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCaptions([]);
  };

  if (!user) {
    return (
      <div>
        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
        <form onSubmit={handleAuth}>
          {!isLogin && (
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account?' : 'Already have an account?'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user.fullName}</h1>
      <button onClick={logout}>Logout</button>

      <h2>Create Caption</h2>
      <form onSubmit={createCaption}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={captionForm.title}
          onChange={handleCaptionChange}
        />
        <textarea
          name="story"
          placeholder="Story"
          value={captionForm.story}
          onChange={handleCaptionChange}
        />
        <input
          type="text"
          name="visitedLocation"
          placeholder="Visited Location"
          value={captionForm.visitedLocation}
          onChange={handleCaptionChange}
        />
        <input
          type="date"
          name="visitedDate"
          value={captionForm.visitedDate}
          onChange={handleCaptionChange}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {captionForm.imageUrl && <img src={captionForm.imageUrl} alt="Uploaded" width="200" />}
        <button type="submit">Create Caption</button>
      </form>

      <h2>Your Captions</h2>
      <button onClick={fetchCaptions}>Load Captions</button>
      {captions.map((caption) => (
        <div key={caption._id}>
          <h3>{caption.title}</h3>
          <p>{caption.story}</p>
          <p>Location: {caption.visitedLocation}</p>
          <p>Date: {new Date(caption.visitedDate).toLocaleDateString()}</p>
          <img src={caption.imageUrl} alt={caption.title} width="300" />
        </div>
      ))}
    </div>
  );
}

export default App;