// backend/index.js
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('b738aea00ec34ec0bdaccdf2ad362066'); // Replace with your actual API key
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());


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
