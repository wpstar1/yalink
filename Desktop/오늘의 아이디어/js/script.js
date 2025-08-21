// Initialize Supabase client
// Note: This assumes your .env file already has SUPABASE_URL and SUPABASE_ANON_KEY
// These values should be loaded from your .env file in a production environment
const supabaseUrl = "https://your-supabase-url.supabase.co";
const supabaseKey = "your-supabase-anon-key";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const ideaList = document.getElementById('ideas-list');
const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const logoutButton = document.getElementById('logout-button');
const myPageButton = document.getElementById('my-page');
const authModal = document.getElementById('auth-modal');
const ideaDetailModal = document.getElementById('idea-detail-modal');
const loginForm = document.getElementById('login-form-element');
const signupForm = document.getElementById('signup-form-element');
const authTabs = document.querySelectorAll('.auth-tab');
const commentInput = document.getElementById('comment-input');
const submitCommentButton = document.getElementById('submit-comment');
const bookmarkButton = document.getElementById('bookmark-button');
const closeButtons = document.querySelectorAll('.close-button');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const mainNav = document.querySelector('.main-nav');

// Current state
let currentUser = null;
let currentIdeaId = null;
let isBookmarked = false;

// 배포 환경에 따라 API URL 설정
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// 프로덕션 환경에서는 실제 API URL을, 개발 환경에서는 로컬 서버 URL을 사용
// 배포 시에는 아래 URL을 실제 서버 URL로 변경하세요
const API_URL = isProduction
  ? 'https://api.바이브코딩.com/api' // 배포 시 실제 API 서버 URL로 변경
  : 'http://localhost:3000/api';

console.log(`🌐 ${isProduction ? '운영' : '개발'} 환경에서 실행 중, API 서버: ${API_URL}`);

// Will store ideas fetched from the server
let ideasList = [];

// 연결 상태 확인
async function checkApiConnection() {
  try {
    const response = await fetch(`${API_URL}/ideas?limit=1`, { 
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      // 짧은 타임아웃 설정
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch (error) {
    console.error('API 서버 연결 확인 실패:', error);
    return false;
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    checkAuthState();
    loadIdeas();
    setupEventListeners();
    checkRememberedUsername();
}

// Check if user is already logged in
async function checkAuthState() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session) {
        currentUser = session.user;
        updateUIForLoggedInUser();
    } else {
        updateUIForLoggedOutUser();
    }
}

// Update UI based on authentication state
function updateUIForLoggedInUser() {
    loginButton.classList.add('hidden');
    signupButton.classList.add('hidden');
    logoutButton.classList.remove('hidden');
    myPageButton.classList.remove('hidden');
    
    // Enable comments and bookmarks
    commentInput.disabled = false;
    submitCommentButton.disabled = false;
}

function updateUIForLoggedOutUser() {
    loginButton.classList.remove('hidden');
    signupButton.classList.remove('hidden');
    logoutButton.classList.add('hidden');
    myPageButton.classList.add('hidden');
    
    // Disable comments and bookmarks
    commentInput.disabled = true;
    submitCommentButton.disabled = true;
}

// Setup all event listeners
function setupEventListeners() {
    // Auth buttons
    loginButton.addEventListener('click', openLoginModal);
    signupButton.addEventListener('click', openSignupModal);
    logoutButton.addEventListener('click', handleLogout);
    
    // Forms
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    
    // Auth tabs
    authTabs.forEach(tab => {
        tab.addEventListener('click', switchAuthTab);
    });
    
    // Close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModals);
    });
    
    // Hamburger menu (mobile)
    hamburgerMenu.addEventListener('click', toggleMobileMenu);
    

    
    // Comments
    submitCommentButton.addEventListener('click', submitComment);
    
    // Bookmark
    bookmarkButton.addEventListener('click', toggleBookmark);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) closeModals();
        if (e.target === ideaDetailModal) closeModals();
    });
}

// Load ideas from API
async function loadIdeas() {
    try {
        ideaList.innerHTML = '<div class="loading">아이디어를 불러오는 중...</div>';
        
        const response = await fetch(`${API_URL}/ideas`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || '아이디어를 불러오는데 실패했습니다.');
        }
        
        ideasList = data.data || [];
        
        ideaList.innerHTML = '';
        
        if (ideasList.length === 0) {
            ideaList.innerHTML = '<div class="no-ideas">아직 아이디어가 없습니다. 매일 아침 5시에 새로운 아이디어가 추가됩니다.</div>';
            return;
        }
        
        ideasList.forEach(idea => {
            const ideaCard = createIdeaCard(idea);
            ideaList.appendChild(ideaCard);
        });
    } catch (error) {
        console.error('Error loading ideas:', error);
        ideaList.innerHTML = `<div class="error">아이디어를 불러오는데 실패했습니다: ${error.message}</div>`;
    }
}

// Create an idea card element
function createIdeaCard(idea) {
    const card = document.createElement('div');
    card.className = 'idea-card';
    card.dataset.id = idea.id;
    
    card.innerHTML = `
        <div class="header">
            <h3>${idea.title}</h3>
            <div class="tag-container">
                <span class="tag">${idea.tag}</span>
            </div>
        </div>
        <div class="content">
            <div class="info-item">
                <h4>요약</h4>
                <p>${idea.summary}</p>
            </div>
            <div class="info-item">
                <h4>난이도</h4>
                <p>${idea.difficulty}</p>
            </div>
        </div>
        <div class="actions">
            <span><i class="far fa-bookmark"></i> ${idea.bookmarks}</span>
            <span><i class="far fa-comment"></i> ${idea.comments}</span>
        </div>
    `;
    
    card.addEventListener('click', () => openIdeaDetail(idea));
    
    return card;
}

// Open idea detail modal
function openIdeaDetail(idea) {
    currentIdeaId = idea.id;
    
    document.getElementById('detail-title').textContent = idea.title;
    document.getElementById('detail-tag').textContent = idea.tag;
    document.getElementById('detail-summary').textContent = idea.summary;
    document.getElementById('detail-features').textContent = idea.features;
    document.getElementById('detail-target').textContent = idea.target;
    document.getElementById('detail-revenue').textContent = idea.revenue;
    document.getElementById('detail-difficulty').textContent = idea.difficulty;
    
    // Clear comment input
    commentInput.value = '';
    
    // Check if the idea is bookmarked by the current user
    checkBookmarkStatus();
    
    // Load comments
    loadComments(idea.id);
    
    ideaDetailModal.style.display = 'block';
}

// Load comments for the current idea
async function loadComments(ideaId) {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '<div class="loading">댓글을 불러오는 중...</div>';
    
    try {
        const response = await fetch(`${API_URL}/ideas/${ideaId}/comments`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || '댓글을 불러오는데 실패했습니다.');
        }
        
        const comments = data.data || [];
        
        commentsContainer.innerHTML = '';
        
        if (comments.length === 0) {
            commentsContainer.innerHTML = '<div class="no-comments">아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</div>';
            return;
        }
        
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment-item';
            
            const date = new Date(comment.created_at);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            
            commentElement.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${formattedDate}</span>
                </div>
                <p>${comment.content}</p>
            `;
            
            commentsContainer.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsContainer.innerHTML = `<div class="error">댓글을 불러오는데 실패했습니다: ${error.message}</div>`;
    }
}

// Check if the current idea is bookmarked by the user
async function checkBookmarkStatus() {
    if (!currentUser) {
        setBookmarkStatus(false);
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/bookmarks?user_id=${currentUser.id}&idea_id=${currentIdeaId}`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            setBookmarkStatus(true);
        } else {
            setBookmarkStatus(false);
        }
    } catch (error) {
        console.error('Error checking bookmark status:', error);
        setBookmarkStatus(false);
    }
}

// Set the bookmark button state
function setBookmarkStatus(bookmarked) {
    isBookmarked = bookmarked;
    
    if (bookmarked) {
        bookmarkButton.innerHTML = '<i class="fas fa-bookmark"></i> 북마크됨';
    } else {
        bookmarkButton.innerHTML = '<i class="far fa-bookmark"></i> 북마크';
    }
}

// Toggle bookmark status
async function toggleBookmark() {
    if (!currentUser) {
        openLoginModal();
        return;
    }
    
    try {
        if (isBookmarked) {
            // Remove bookmark
            const response = await fetch(`${API_URL}/bookmarks`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    idea_id: currentIdeaId
                })
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || '북마크 삭제에 실패했습니다.');
            }
            
            setBookmarkStatus(false);
        } else {
            // Add bookmark
            const response = await fetch(`${API_URL}/bookmarks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    idea_id: currentIdeaId
                })
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || '북마크 추가에 실패했습니다.');
            }
            
            setBookmarkStatus(true);
        }
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        alert(`북마크 상태 변경에 실패했습니다: ${error.message}`);
    }
}

// Submit a comment
async function submitComment() {
    if (!currentUser) {
        openLoginModal();
        return;
    }
    
    const content = commentInput.value.trim();
    if (!content) return;
    
    try {
        // Disable the submit button while submitting
        submitCommentButton.disabled = true;
        submitCommentButton.textContent = '등록 중...';
        
        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: currentUser.id,
                idea_id: currentIdeaId,
                content: content
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || '댓글 등록에 실패했습니다.');
        }
        
        // Clear the input field
        commentInput.value = '';
        
        // Reload the comments to show the new one
        await loadComments(currentIdeaId);
    } catch (error) {
        console.error('Error submitting comment:', error);
        alert(`댓글 등록에 실패했습니다: ${error.message}`);
    } finally {
        // Re-enable the submit button
        submitCommentButton.disabled = false;
        submitCommentButton.textContent = '등록';
    }
}



// Toggle mobile menu
function toggleMobileMenu() {
    mainNav.classList.toggle('active');
}

// Auth functions
function openLoginModal() {
    document.querySelector('[data-tab="login"]').click();
    authModal.style.display = 'block';
}

function openSignupModal() {
    document.querySelector('[data-tab="signup"]').click();
    authModal.style.display = 'block';
}

function closeModals() {
    authModal.style.display = 'none';
    ideaDetailModal.style.display = 'none';
}

function switchAuthTab(e) {
    const tab = e.target.dataset.tab;
    
    // Update active tab
    authTabs.forEach(t => {
        t.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Show corresponding form
    if (tab === 'login') {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('signup-form').classList.add('hidden');
    } else {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('signup-form').classList.remove('hidden');
    }
}

// Check for remembered username
function checkRememberedUsername() {
    const rememberedUsername = getCookie('remembered_username');
    if (rememberedUsername) {
        document.getElementById('login-username').value = rememberedUsername;
        document.getElementById('remember-username').checked = true;
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const rememberUsername = document.getElementById('remember-username').checked;
    
    if (rememberUsername) {
        setCookie('remembered_username', username, 30); // Remember for 30 days
    } else {
        eraseCookie('remembered_username');
    }
    
    try {
        // In production, this would use Supabase auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email: `${username}@example.com`, // We're using username as login, but Supabase requires email format
            password: password
        });
        
        if (error) throw error;
        
        currentUser = data.user;
        updateUIForLoggedInUser();
        closeModals();
    } catch (error) {
        alert('로그인 실패: ' + error.message);
    }
}

// Handle signup form submission
async function handleSignup(e) {
    e.preventDefault();
    
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-password-confirm').value;
    
    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }
    
    try {
        // In production, this would use Supabase auth
        const { data, error } = await supabase.auth.signUp({
            email: `${username}@example.com`, // We're using username as login, but Supabase requires email format
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        });
        
        if (error) throw error;
        
        currentUser = data.user;
        updateUIForLoggedInUser();
        closeModals();
        alert('회원가입 성공! 자동으로 로그인되었습니다.');
    } catch (error) {
        alert('회원가입 실패: ' + error.message);
    }
}

// Handle logout
async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        currentUser = null;
        updateUIForLoggedOutUser();
    } catch (error) {
        alert('로그아웃 실패: ' + error.message);
    }
}

// Cookie utilities for remembering username
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}
