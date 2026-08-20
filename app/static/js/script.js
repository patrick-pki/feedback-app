// State
let feedbackData = [];

// DOM Elements
const feedbackList = document.getElementById('feedbackList');
const feedbackForm = document.getElementById('feedbackForm');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Rating Stars Logic
const stars = document.querySelectorAll('.rating-stars span');
const ratingInput = document.getElementById('rating');

stars.forEach(star => {
    star.addEventListener('click', () => {
        const value = parseInt(star.dataset.value);
        ratingInput.value = value;
        updateStars(value);
    });
    
    star.addEventListener('mouseenter', () => {
        const value = parseInt(star.dataset.value);
        updateStars(value);
    });
    
    star.addEventListener('mouseleave', () => {
        updateStars(parseInt(ratingInput.value));
    });
});

function updateStars(value) {
    stars.forEach(star => {
        const starValue = parseInt(star.dataset.value);
        star.classList.toggle('active', starValue <= value);
    });
}

// Load initial data
async function loadFeedback() {
    try {
        const response = await fetch('/api/feedback');
        feedbackData = await response.json();
        renderFeedback(feedbackData);
        updateStats();
    } catch (error) {
        console.error('Error loading feedback:', error);
    }
}

// Render feedback items
function renderFeedback(feedbacks) {
    if (feedbacks.length === 0) {
        feedbackList.innerHTML = `
            <div class="empty-state">
                <p>✨ No feedback yet. Be the first to share!</p>
            </div>
        `;
        return;
    }
    
    feedbackList.innerHTML = feedbacks.map(f => `
        <div class="feedback-item">
            <div class="feedback-header">
                <span class="feedback-name">${escapeHtml(f.name)}</span>
                <span class="feedback-rating">${'⭐'.repeat(f.rating)}</span>
            </div>
            <div>
                <span class="feedback-category">${escapeHtml(f.category)}</span>
            </div>
            <p class="feedback-message">${escapeHtml(f.message)}</p>
            <small class="feedback-time">${new Date(f.created_at).toLocaleString()}</small>
        </div>
    `).join('');
}

// Update statistics
async function updateStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        
        document.getElementById('totalFeedback').textContent = stats.total_feedback;
        document.getElementById('avgRating').textContent = stats.average_rating;
        
        if (stats.categories.length > 0) {
            document.getElementById('topCategory').textContent = stats.categories[0].name;
        }
        
        // Calculate unique users (simplified)
        const uniqueNames = new Set(feedbackData.map(f => f.name));
        document.getElementById('uniqueUsers').textContent = uniqueNames.size;
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Submit feedback
feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        category: document.getElementById('category').value,
        rating: parseInt(ratingInput.value),
        message: document.getElementById('message').value.trim()
    };
    
    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showToast('✅ Feedback submitted successfully!', 'success');
            feedbackForm.reset();
            ratingInput.value = 3;
            updateStars(3);
            loadFeedback();
        } else {
            showToast('❌ Failed to submit feedback. Please try again.', 'error');
        }
    } catch (error) {
        showToast('❌ Network error. Please check your connection.', 'error');
    }
});

// Refresh button
document.getElementById('refreshBtn').addEventListener('click', () => {
    loadFeedback();
    showToast('🔄 Feedback refreshed!', 'success');
});

// Toast notification
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize
loadFeedback();

// Auto-refresh every 30 seconds
setInterval(loadFeedback, 30000);
