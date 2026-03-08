/**
 * HireAI Chrome Extension - Popup Script
 * Handles popup UI interactions: user status check, sidebar activation/deactivation.
 */

const API_BASE_URL = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', async () => {
    const activateBtn = document.getElementById('activateBtn');
    const statusDot = document.getElementById('statusDot');
    const statusLabel = document.getElementById('statusLabel');
    const statusDetail = document.getElementById('statusDetail');
    const userCard = document.getElementById('userCard');
    const notLoggedIn = document.getElementById('notLoggedIn');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    const loginBtn = document.getElementById('loginBtn');

    let isActive = false;

    // Check current sidebar state
    chrome.storage.local.get(['sidebarVisible'], (result) => {
        isActive = result.sidebarVisible || false;
        updateButtonState();
    });

    // Check auth status
    try {
        const response = await chrome.runtime.sendMessage({ action: 'getCurrentUser' });
        if (response.success && response.data && response.data.user) {
            const user = response.data.user;
            notLoggedIn.style.display = 'none';
            userCard.style.display = 'flex';
            userName.textContent = user.displayName || user.firstName || 'User';
            userEmail.textContent = user.email || '';
            userAvatar.textContent = (user.displayName || user.firstName || 'U').charAt(0).toUpperCase();

            statusDot.classList.remove('offline');
            statusLabel.textContent = 'Connected';
            statusDetail.textContent = 'Logged in to HireAI';
        } else {
            showNotLoggedIn();
        }
    } catch (err) {
        showNotLoggedIn();
    }

    function showNotLoggedIn() {
        notLoggedIn.style.display = 'block';
        userCard.style.display = 'none';
        statusDot.classList.add('offline');
        statusLabel.textContent = 'Not Connected';
        statusDetail.textContent = 'Please log in to HireAI first';
    }

    // Login button
    loginBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: 'http://localhost:5173/login' });
    });

    // Activate/Deactivate button
    activateBtn.addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) return;

        try {
            await chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
            isActive = !isActive;
            updateButtonState();
        } catch (err) {
            // Content script not injected, inject it first
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });
            setTimeout(async () => {
                await chrome.tabs.sendMessage(tab.id, { action: 'showSidebar' });
                isActive = true;
                updateButtonState();
            }, 500);
        }

        // Close popup after activation
        setTimeout(() => window.close(), 300);
    });

    function updateButtonState() {
        if (isActive) {
            activateBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6L6 18"></path>
          <path d="M6 6l12 12"></path>
        </svg>
        Deactivate Assistant
      `;
            activateBtn.classList.add('deactivate-btn');
        } else {
            activateBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"></path>
          <path d="M12 5l7 7-7 7"></path>
        </svg>
        Activate AI Assistant
      `;
            activateBtn.classList.remove('deactivate-btn');
        }
    }
});
