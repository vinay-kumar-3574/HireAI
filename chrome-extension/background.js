/**
 * HireAI Chrome Extension - Background Service Worker
 * Handles messaging between popup, content script, and sidebar.
 * Manages API calls to the backend server.
 */

const API_BASE_URL = 'http://localhost:5000';

// ─────────────────────────────────────────────
// Toggle sidebar when extension icon is clicked
// ─────────────────────────────────────────────
chrome.action.onClicked.addListener(async (tab) => {
    try {
        await chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
    } catch (err) {
        // Content script might not be injected yet
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        });
        setTimeout(async () => {
            await chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
        }, 500);
    }
});

// ─────────────────────────────────────────────
// Message handler for API calls from sidebar
// ─────────────────────────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'apiCall') {
        handleApiCall(request)
            .then(data => sendResponse({ success: true, data }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        return true; // Keep message channel open for async response
    }

    if (request.action === 'getCurrentUser') {
        fetchCurrentUser()
            .then(data => sendResponse({ success: true, data }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        return true;
    }

    if (request.action === 'getActiveResume') {
        fetchActiveResume()
            .then(data => sendResponse({ success: true, data }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        return true;
    }

    if (request.action === 'tailorResume') {
        tailorResume(request.payload)
            .then(data => sendResponse({ success: true, data }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        return true;
    }

    if (request.action === 'generateCoverLetter') {
        generateCoverLetter(request.payload)
            .then(data => sendResponse({ success: true, data }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        return true;
    }

    if (request.action === 'saveJob') {
        saveJob(request.payload)
            .then(data => sendResponse({ success: true, data }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        return true;
    }
});

// ─────────────────────────────────────────────
// API Helper Functions
// ─────────────────────────────────────────────

async function handleApiCall({ method, endpoint, body }) {
    const options = {
        method: method || 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }
    return response.json();
}

async function fetchCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/current-user`, {
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Not authenticated. Please log in to HireAI.');
    }
    return response.json();
}

async function fetchActiveResume() {
    const response = await fetch(`${API_BASE_URL}/api/resumes`, {
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch resumes.');
    }
    const data = await response.json();
    // Return the first resume (or the one marked active)
    const resumes = data.resumes || [];
    const active = resumes.find(r => r.isActive) || resumes[0];
    if (!active) {
        throw new Error('No resume found. Please upload a resume in HireAI first.');
    }
    return active;
}

async function tailorResume({ resumeText, jobDescription, jobTitle, company }) {
    const response = await fetch(`${API_BASE_URL}/api/extension/tailor-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ resumeText, jobDescription, jobTitle, company }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to tailor resume.');
    }
    return response.json();
}

async function generateCoverLetter({ resumeText, jobDescription, jobTitle, company }) {
    const response = await fetch(`${API_BASE_URL}/api/extension/generate-cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ resumeText, jobDescription, jobTitle, company }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate cover letter.');
    }
    return response.json();
}

async function saveJob({ jobTitle, company, jobUrl, status, location, salary, jobType }) {
    const response = await fetch(`${API_BASE_URL}/api/extension/save-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ jobTitle, company, jobUrl, status, location, salary, jobType }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save job.');
    }
    return response.json();
}
