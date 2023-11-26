// backend/index.js
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('b738aea00ec34ec0bdaccdf2ad362066'); // Replace with your actual API key
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const express = require('express');
const cors = require('cors');

const app = express();
const allowedOrigins = ['http://127.0.0.1:5173', 'http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

const fetchNewsForDate = async (date) => {
    try {
      const response = await newsapi.v2.everything({
        q: 'cryptocurrency',
        language: 'en',
        from: date,
        to: date,
        sortBy: 'publishedAt'
      });
  
      return response.articles.map(article => ({
        ...article,
        sentimentScore: sentiment.analyze(article.description || article.title).score
      }));
    } catch (error) {
      console.error('Error fetching news for date:', date, error);
      return [];
    }
};

app.get('/api/daily-sentiment', async (req, res) => {
    const days = 14;
    const dailySentiments = [];
  
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
      const articles = await fetchNewsForDate(formattedDate);
      const dailyAverage = articles.reduce((acc, article) => acc + article.sentimentScore, 0) / articles.length || 0;
  
      dailySentiments.push({ date: formattedDate, averageSentiment: dailyAverage });
    }
  
    res.json(dailySentiments);
});

// New endpoint for crypto news
app.get('/api/crypto-news', async (req, res) => {
    try {
        const response = await newsapi.v2.everything({
            q: 'cryptocurrency',
            language: 'en',
            sortBy: 'publishedAt' // Sorting by publication date
        });

        const articlesWithSentiment = response.articles.map(article => {
            const sentimentResult = sentiment.analyze(article.description || article.title);
            return { 
                ...article, 
                sentimentScore: sentimentResult.score,
                publishedAt: article.publishedAt // Include the publication date
            };
        });

        res.json(articlesWithSentiment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
