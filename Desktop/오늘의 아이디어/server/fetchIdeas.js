require('dotenv').config({ path: '../.env' });
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// The main function to fetch and store ideas
async function fetchAndStoreIdeas(count = 5) {
  try {
    console.log(`[${new Date().toISOString()}] 🚀 GPT에서 새로운 비즈니스 아이디어를 가져오는 중...`);
    
    // 최대 3번까지 재시도
    let ideas = [];
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts && ideas.length === 0) {
      try {
        ideas = await generateBusinessIdeas(count);
        if (ideas.length === 0) {
          throw new Error('GPT가 유효한 아이디어를 반환하지 않았습니다.');
        }
      } catch (error) {
        attempts++;
        console.error(`[${new Date().toISOString()}] ⚠️ 시도 ${attempts}/${maxAttempts} 실패: ${error.message}`);
        
        if (attempts >= maxAttempts) {
          throw new Error(`${maxAttempts}회 시도 후 아이디어를 가져오지 못했습니다: ${error.message}`);
        }
        
        // 잠시 대기 후 재시도
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    console.log(`[${new Date().toISOString()}] ✅ ${ideas.length}개의 아이디어를 생성했습니다. 데이터베이스에 저장 중...`);
    
    // Store each idea in the database and track results
    const results = {
      success: 0,
      failed: 0,
      ideas: []
    };
    
    for (const idea of ideas) {
      try {
        // 데이터 유효성 검사
        if (!idea.title || !idea.summary) {
          throw new Error('유효하지 않은 아이디어 데이터');
        }
        
        const { data, error } = await supabase
          .from('ideas')
          .insert([
            {
              title: idea.title,
              tag: idea.tag || '오늘의 돈이 될 만한 AI/SaaS/자동화 아이디어',
              summary: idea.summary,
              features: idea.features,
              target: idea.target,
              revenue: idea.revenue,
              difficulty: idea.difficulty,
              created_at: new Date().toISOString()
            }
          ]);
          
        if (error) {
          throw error;
        }
        
        results.success++;
        results.ideas.push(idea.title);
      } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ 아이디어 저장 실패: ${error.message}`, idea.title || 'unknown');
        results.failed++;
      }
    }
    
    console.log(`[${new Date().toISOString()}] 📊 결과: ${results.success}개 성공, ${results.failed}개 실패`);
    console.log(`[${new Date().toISOString()}] 💡 저장된 아이디어: ${results.ideas.join(', ')}`);
    
    return ideas;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] 🚨 fetchAndStoreIdeas 오류:`, error);
    throw error;
  }
}

// Function to generate business ideas using GPT
async function generateBusinessIdeas(count = 5) {
  try {
    const systemPrompt = `당신은 기업가와 창업 아이디어 전문가입니다. 수익성 있고 실현 가능한 아이디어를 제안해 주세요.`;
    
    const userPrompt = `오늘의 돈이 될 만한 AI/SaaS/자동화 아이디어를 ${count}개 제안해주세요. 
각 아이디어는 다음 형식으로 JSON 배열에 포함해 주세요:
{
  "title": "아이디어 제목",
  "tag": "오늘의 돈이 될 만한 AI/SaaS/자동화 아이디어",
  "summary": "간단한 요약 (한두 문장)",
  "features": "주요 기능 설명 (쉼표로 구분된 목록)",
  "target": "타겟 고객층",
  "revenue": "수익 모델",
  "difficulty": "난이도 (낮음, 중간, 높음 중 하나)"
}

한국어로 작성해 주시고, 현실적이고 실행 가능한 아이디어만 제안해 주세요. JSON 배열만 반환해 주세요.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    // Extract and parse the JSON array from the response
    const content = response.choices[0].message.content;
    
    // Find the JSON array in the response (in case there's additional text)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from GPT response');
    }
    
    // Parse the JSON array
    const ideas = JSON.parse(jsonMatch[0]);
    return ideas;
  } catch (error) {
    console.error('Error generating business ideas:', error);
    throw error;
  }
}

module.exports = {
  fetchAndStoreIdeas,
  generateBusinessIdeas
};
