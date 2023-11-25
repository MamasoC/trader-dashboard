// src/NewsComponent.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NewsComponent() {
  const [articles, setArticles] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('date'); // 'date' or 'sentiment'
  const [isReversed, setIsReversed] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/crypto-news');
        // Ensure your articles have a date property
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  // Calculate average sentiment score
  const averageSentiment = articles.reduce((acc, article) => acc + article.sentimentScore, 0) / articles.length;

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortCriteria === 'date') {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    }
    return b.sentimentScore - a.sentimentScore;
  });

  if (isReversed) {
    sortedArticles.reverse();
  }

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const toggleOrder = () => {
    setIsReversed(!isReversed);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div>
          <select onChange={handleSortChange} className="border p-2 rounded mr-2">
            <option value="date">Sort by Date</option>
            <option value="sentiment">Sort by Sentiment Score</option>
          </select>
          <button onClick={toggleOrder} className="border p-2 rounded">
            {isReversed ? 'Normal Order' : 'Reverse Order'}
          </button>
        </div>
        <div>
          <span className="text-sm font-semibold">Average Sentiment: </span>
          <span className={`${averageSentiment > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {averageSentiment.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedArticles.map((article, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
            <p className="text-sm text-gray-600">{article.description}</p>
            <p className={`text-sm ${article.sentimentScore > 0 ? 'text-green-600' : 'text-red-600'}`}>
              Sentiment Score: {article.sentimentScore}
            </p>
            <p className="text-sm text-gray-500">Date: {new Date(article.publishedAt).toLocaleDateString()}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsComponent;
