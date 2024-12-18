import { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.REACT_APP_API_KEY}`;

  const handleSearch = async () => {
    if (!query.trim()) {
      alert('Please enter a query!');
      return;
    }

    setIsLoading(true);
    setResponse('');

    try {
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: query,
              },
            ],
          },
        ],
      };

      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await apiResponse.json();
      console.log('API Response:', data);

      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        setResponse(data.candidates[0].content.parts[0].text);
      } else {
        setResponse('No valid content found in the API response.');
      }
    } catch (error) {
      setResponse(`Error: ${error.message}`);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponse = (text) => {
    if (!text) return text;

    text = text.replace(/\*bold-black>/g, '');
    text = text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
    text = text.replace(/"([^"]+)"/g, '<strong>$1</strong>');

    return text;
  };

  return (
    <div className="app">
      <h1 className="heading">DostGpt</h1>
      <div className="boxbut">
        <input
          type="text"
          id="searchInput"
          placeholder="Type Your Query Here"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button id="searchButton" onClick={handleSearch}>
          Search
        </button>
      </div>

      {isLoading && <div className="loading">Loading...</div>}

      {response && (
        <div id="output">
          <div
            className="responseText"
            dangerouslySetInnerHTML={{ __html: formatResponse(response) }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
