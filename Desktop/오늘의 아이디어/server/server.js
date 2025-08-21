require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const helmet = require('helmet');
const { fetchAndStoreIdeas } = require('./fetchIdeas');
const { createClient } = require('@supabase/supabase-js');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';

// Middleware
app.use(helmet()); // 보안 헤더 추가
app.use(cors({
  origin: isProd ? process.env.FRONTEND_URL : '*', // 운영 환경에서는 특정 출처만 허용
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Schedule daily idea fetching every day at 5:00 AM
cron.schedule('0 5 * * *', async () => {
  console.log('Running scheduled task: Fetching new business ideas from GPT');
  try {
    await fetchAndStoreIdeas();
    console.log('Successfully fetched and stored new ideas');
  } catch (error) {
    console.error('Error in scheduled idea fetching:', error);
  }
});

// Route to manually trigger idea fetching (for testing)
app.post('/api/fetch-ideas', async (req, res) => {
  try {
    await fetchAndStoreIdeas();
    res.status(200).json({ success: true, message: '5 new ideas fetched and stored' });
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to get all ideas
app.get('/api/ideas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route to get a specific idea
app.get('/api/ideas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching idea:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// API route for comments
app.post('/api/comments', async (req, res) => {
  try {
    const { user_id, idea_id, content } = req.body;
    
    const { data, error } = await supabase
      .from('comments')
      .insert([
        { user_id, idea_id, content }
      ]);
    
    if (error) throw error;
    
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// API route for bookmarks
app.post('/api/bookmarks', async (req, res) => {
  try {
    const { user_id, idea_id } = req.body;
    
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([
        { user_id, idea_id }
      ]);
    
    if (error) throw error;
    
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: isProd ? '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.' : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청하신 API 엔드포인트를 찾을 수 없습니다.'
  });
});

// 서버 시작 시 데이터 초기 로딩 (첫 실행용)
if (process.env.INITIAL_FETCH === 'true') {
  fetchAndStoreIdeas()
    .then(() => console.log('🔍 초기 아이디어 데이터를 성공적으로 불러왔습니다.'))
    .catch(err => console.error('❌ 초기 아이디어 데이터 로딩 실패:', err));
}

// Start the server
app.listen(PORT, () => {
  console.log(`✅ 서버가 ${PORT} 포트에서 실행 중입니다 (환경: ${NODE_ENV})`);
  console.log('⏰ 매일 아침 5시에 아이디어 자동 업데이트가 예약되었습니다');
});
