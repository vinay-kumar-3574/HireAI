/**
 * HireAI Chrome Extension - Sidebar Script
 * Handles all sidebar UI logic: displaying job data, tailoring resume,
 * generating cover letters, ATS scoring, and job match insights.
 */

// ─────────────────────────────────────────────
// State
// ─────────────────────────────────────────────
let currentJobData = null;
let currentResumeData = null;
let pendingRequests = {};
let requestIdCounter = 0;

// ─────────────────────────────────────────────
// DOM Elements
// ─────────────────────────────────────────────
const elements = {
    loadingState: document.getElementById('loadingState'),
    jobInfoSection: document.getElementById('jobInfoSection'),
    jobTitle: document.getElementById('jobTitle'),
    companyName: document.getElementById('companyName'),
    jobLocation: document.getElementById('jobLocation'),
    jobSalary: document.getElementById('jobSalary'),
    jobType: document.getElementById('jobType'),
    highlightsSection: document.getElementById('highlightsSection'),
    highlightsList: document.getElementById('highlightsList'),
    skillsSection: document.getElementById('skillsSection'),
    skillsTags: document.getElementById('skillsTags'),
    qualificationsSection: document.getElementById('qualificationsSection'),
    qualificationsList: document.getElementById('qualificationsList'),
    atsSection: document.getElementById('atsSection'),
    atsProgress: document.getElementById('atsProgress'),
    atsNumber: document.getElementById('atsNumber'),
    atsRecalc: document.getElementById('atsRecalc'),
    insightsSection: document.getElementById('insightsSection'),
    insightsContainer: document.getElementById('insightsContainer'),
    tailoringSection: document.getElementById('tailoringSection'),
    suggestionsList: document.getElementById('suggestionsList'),
    suggestionActions: document.getElementById('suggestionActions'),
    coverLetterSection: document.getElementById('coverLetterSection'),
    coverLetterContent: document.getElementById('coverLetterContent'),
    tailorResumeBtn: document.getElementById('tailorResumeBtn'),
    tailorTime: document.getElementById('tailorTime'),
    coverLetterBtn: document.getElementById('coverLetterBtn'),
    reloadBtn: document.getElementById('reloadBtn'),
    markApplied: document.getElementById('markApplied'),
    editResumeBtn: document.getElementById('editResumeBtn'),
    acceptAllBtn: document.getElementById('acceptAllBtn'),
    resetChangesBtn: document.getElementById('resetChangesBtn'),
    copyCoverLetterBtn: document.getElementById('copyCoverLetterBtn'),
};

// ─────────────────────────────────────────────
// Communication with Content Script (via parent)
// ─────────────────────────────────────────────
function sendApiRequest(payload) {
    return new Promise((resolve, reject) => {
        const requestId = `req_${++requestIdCounter}_${Date.now()}`;
        pendingRequests[requestId] = { resolve, reject };

        window.parent.postMessage({
            type: 'HIREAI_API_REQUEST',
            requestId: requestId,
            payload: payload,
        }, '*');

        // Timeout after 60 seconds
        setTimeout(() => {
            if (pendingRequests[requestId]) {
                delete pendingRequests[requestId];
                reject(new Error('Request timed out'));
            }
        }, 60000);
    });
}

// Listen for API responses
window.addEventListener('message', (event) => {
    // Handle job data from content script
    if (event.data && event.data.type === 'HIREAI_JOB_DATA') {
        handleJobData(event.data.data);
    }

    // Handle API response
    if (event.data && event.data.type === 'HIREAI_API_RESPONSE') {
        const { requestId, response } = event.data;
        if (pendingRequests[requestId]) {
            if (response && response.success) {
                pendingRequests[requestId].resolve(response.data);
            } else {
                pendingRequests[requestId].reject(new Error(response?.error || 'API request failed'));
            }
            delete pendingRequests[requestId];
        }
    }
});

// ─────────────────────────────────────────────
// Job Data Handler
// ─────────────────────────────────────────────
function handleJobData(data) {
    currentJobData = data;

    // Hide loading
    elements.loadingState.style.display = 'none';

    // Show job info
    elements.jobInfoSection.style.display = 'block';
    elements.jobTitle.textContent = data.jobTitle || 'Job Title Not Found';
    elements.companyName.textContent = data.company || 'Company Not Found';

    // Location
    const locationSpan = elements.jobLocation.querySelector('span');
    if (data.location) {
        locationSpan.textContent = data.location;
        elements.jobLocation.style.display = 'inline-flex';
    } else {
        elements.jobLocation.style.display = 'none';
    }

    // Salary
    const salarySpan = elements.jobSalary.querySelector('span');
    if (data.salary) {
        salarySpan.textContent = data.salary;
        elements.jobSalary.style.display = 'inline-flex';
    } else {
        elements.jobSalary.style.display = 'none';
    }

    // Job Type
    const typeSpan = elements.jobType.querySelector('span');
    typeSpan.textContent = data.jobType || 'Full-time';

    // Highlights
    if (data.highlights && data.highlights.length > 0) {
        elements.highlightsSection.style.display = 'block';
        elements.highlightsList.innerHTML = data.highlights
            .map(h => `<li>${escapeHtml(h)}</li>`)
            .join('');
    } else {
        elements.highlightsSection.style.display = 'none';
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
        elements.skillsSection.style.display = 'block';
        renderSkills(data.skills);
    } else {
        elements.skillsSection.style.display = 'none';
    }

    // Qualifications
    if (data.qualifications && data.qualifications.length > 0) {
        elements.qualificationsSection.style.display = 'block';
        renderQualifications(data.qualifications);
    } else {
        elements.qualificationsSection.style.display = 'none';
    }

    // Show tailor time badge
    elements.tailorTime.style.display = 'inline';
}

function renderSkills(skills) {
    const MAX_VISIBLE = 6;
    const visible = skills.slice(0, MAX_VISIBLE);
    const remaining = skills.length - MAX_VISIBLE;

    let html = visible
        .map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`)
        .join('');

    if (remaining > 0) {
        html += `<span class="skill-tag more" data-skills='${JSON.stringify(skills)}'>+${remaining} more</span>`;
    }

    elements.skillsTags.innerHTML = html;

    // Click handler for "more" tag
    const moreTag = elements.skillsTags.querySelector('.skill-tag.more');
    if (moreTag) {
        moreTag.addEventListener('click', () => {
            elements.skillsTags.innerHTML = skills
                .map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`)
                .join('');
        });
    }
}

function renderQualifications(qualifications) {
    const MAX_VISIBLE = 3;
    const visible = qualifications.slice(0, MAX_VISIBLE);
    const remaining = qualifications.length - MAX_VISIBLE;

    let html = visible
        .map(q => `<li>${escapeHtml(q)}</li>`)
        .join('');

    elements.qualificationsList.innerHTML = html;

    // Add "more" button if needed
    if (remaining > 0) {
        const moreSpan = document.createElement('span');
        moreSpan.className = 'qual-more';
        moreSpan.textContent = `+${remaining} more`;
        moreSpan.addEventListener('click', () => {
            elements.qualificationsList.innerHTML = qualifications
                .map(q => `<li>${escapeHtml(q)}</li>`)
                .join('');
            moreSpan.remove();
        });
        elements.qualificationsList.parentNode.appendChild(moreSpan);
    }
}

// ─────────────────────────────────────────────
// Tailor Resume
// ─────────────────────────────────────────────
elements.tailorResumeBtn.addEventListener('click', async () => {
    if (!currentJobData) {
        showToast('Please wait for job data to load.', 'error');
        return;
    }

    const btn = elements.tailorResumeBtn;
    btn.classList.add('loading');
    btn.disabled = true;

    try {
        // 1. Get active resume
        const resume = await sendApiRequest({ action: 'getActiveResume' });
        currentResumeData = resume;

        // 2. Send to backend for tailoring
        const result = await sendApiRequest({
            action: 'tailorResume',
            payload: {
                resumeText: resume.extractedText || '',
                jobDescription: currentJobData.description || '',
                jobTitle: currentJobData.jobTitle || '',
                company: currentJobData.company || '',
            }
        });

        // 3. Display results
        displayTailoringResults(result);

    } catch (err) {
        console.error('Tailor resume error:', err);
        showToast(err.message || 'Failed to tailor resume. Please try again.', 'error');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
});

function displayTailoringResults(result) {
    // Show ATS Score
    if (result.atsScore !== undefined) {
        displayAtsScore(result.atsScore);
    }

    // Show Job Match Insights
    if (result.insights) {
        displayInsights(result.insights);
    }

    // Show Resume Suggestions
    if (result.suggestions && result.suggestions.length > 0) {
        displaySuggestions(result.suggestions);
    }

    // Scroll to results
    elements.atsSection.scrollIntoView({ behavior: 'smooth' });
}

function displayAtsScore(score) {
    elements.atsSection.style.display = 'block';

    const circumference = 2 * Math.PI * 52; // 326.73
    const offset = circumference - (score / 100) * circumference;

    // Set color
    elements.atsProgress.classList.remove('green', 'orange', 'red');
    if (score >= 70) {
        elements.atsProgress.classList.add('green');
    } else if (score >= 40) {
        elements.atsProgress.classList.add('orange');
    } else {
        elements.atsProgress.classList.add('red');
    }

    // Animate
    setTimeout(() => {
        elements.atsProgress.style.strokeDashoffset = offset;
    }, 100);

    // Animate number
    animateNumber(elements.atsNumber, 0, score, 1500);
}

function animateNumber(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.round(start + range * eased);
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function displayInsights(insights) {
    elements.insightsSection.style.display = 'block';

    let html = '';

    // Job Title Match
    if (insights.jobTitleMatch !== undefined) {
        html += `
      <div class="insight-row">
        <div class="insight-left">
          <div class="insight-title">Job Title Match</div>
          <div class="insight-detail">
            Current: ${escapeHtml(insights.currentTitle || '—')}<br>
            Required: ${escapeHtml(insights.requiredTitle || '—')}
          </div>
        </div>
        <span class="insight-badge ${insights.jobTitleMatch ? 'matched' : 'not-matched'}">
          ${insights.jobTitleMatch ? 'Matched' : 'Not Matched'}
        </span>
      </div>
    `;
    }

    // Education Match
    if (insights.educationMatch !== undefined) {
        html += `
      <div class="insight-row">
        <div class="insight-left">
          <div class="insight-title">Education Match</div>
          <div class="insight-detail">
            Current: ${escapeHtml(insights.currentEducation || '—')}<br>
            Required: ${escapeHtml(insights.requiredEducation || '—')}
          </div>
        </div>
        <span class="insight-badge ${insights.educationMatch ? 'matched' : 'not-matched'}">
          ${insights.educationMatch ? 'Matched' : 'Not Matched'}
        </span>
      </div>
    `;
    }

    // Hard Skills Match
    if (insights.matchedSkills || insights.unmatchedSkills) {
        html += `
      <div class="insight-skills">
        <div class="insight-skills-title">Hard Skills Match</div>
        <div class="insight-skills-tags">
          ${(insights.matchedSkills || []).map(s => `<span class="skill-tag matched">${escapeHtml(s)}</span>`).join('')}
          ${(insights.unmatchedSkills || []).map(s => `<span class="skill-tag unmatched">${escapeHtml(s)}</span>`).join('')}
        </div>
      </div>
    `;
    }

    elements.insightsContainer.innerHTML = html;
}

function displaySuggestions(suggestions) {
    elements.tailoringSection.style.display = 'block';
    elements.suggestionActions.style.display = 'flex';

    let html = suggestions.map((s, i) => `
    <div class="suggestion-item" data-index="${i}">
      <div class="suggestion-category">${escapeHtml(s.category || 'Improvement')}</div>
      <div class="suggestion-original">${escapeHtml(s.original || '')}</div>
      <span class="suggestion-arrow">→</span>
      <div class="suggestion-improved">${escapeHtml(s.improved || '')}</div>
      <div class="suggestion-controls">
        <button class="accept-btn" data-index="${i}" title="Accept">✓</button>
        <button class="reject-btn" data-index="${i}" title="Reject">✗</button>
      </div>
    </div>
  `).join('');

    elements.suggestionsList.innerHTML = html;

    // Attach event listeners
    elements.suggestionsList.querySelectorAll('.accept-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.suggestion-item');
            item.style.opacity = '0.5';
            item.querySelector('.suggestion-original').style.display = 'none';
            item.querySelector('.suggestion-arrow').style.display = 'none';
            btn.style.background = '#f0fdf4';
            showToast('Change accepted!', 'success');
        });
    });

    elements.suggestionsList.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.suggestion-item');
            item.style.display = 'none';
            showToast('Change rejected.', 'error');
        });
    });
}

// Accept All
elements.acceptAllBtn.addEventListener('click', () => {
    elements.suggestionsList.querySelectorAll('.suggestion-item').forEach(item => {
        item.style.opacity = '0.5';
        item.querySelector('.suggestion-original').style.display = 'none';
        item.querySelector('.suggestion-arrow').style.display = 'none';
    });
    showToast('All changes accepted!', 'success');
});

// Reset
elements.resetChangesBtn.addEventListener('click', () => {
    elements.suggestionsList.querySelectorAll('.suggestion-item').forEach(item => {
        item.style.opacity = '1';
        item.style.display = 'block';
        item.querySelector('.suggestion-original').style.display = 'block';
        item.querySelector('.suggestion-arrow').style.display = 'block';
    });
    showToast('Changes reset.', 'success');
});

// ─────────────────────────────────────────────
// Cover Letter
// ─────────────────────────────────────────────
elements.coverLetterBtn.addEventListener('click', async () => {
    if (!currentJobData) {
        showToast('Please wait for job data to load.', 'error');
        return;
    }

    const btn = elements.coverLetterBtn;
    btn.classList.add('loading');
    btn.disabled = true;

    try {
        // Get resume if not already loaded
        if (!currentResumeData) {
            currentResumeData = await sendApiRequest({ action: 'getActiveResume' });
        }

        const result = await sendApiRequest({
            action: 'generateCoverLetter',
            payload: {
                resumeText: currentResumeData.extractedText || '',
                jobDescription: currentJobData.description || '',
                jobTitle: currentJobData.jobTitle || '',
                company: currentJobData.company || '',
            }
        });

        displayCoverLetter(result.coverLetter || result);

    } catch (err) {
        console.error('Cover letter error:', err);
        showToast(err.message || 'Failed to generate cover letter.', 'error');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
});

function displayCoverLetter(text) {
    elements.coverLetterSection.style.display = 'block';
    elements.coverLetterContent.textContent = typeof text === 'string' ? text : JSON.stringify(text, null, 2);
    elements.coverLetterSection.scrollIntoView({ behavior: 'smooth' });
}

// Copy cover letter
elements.copyCoverLetterBtn.addEventListener('click', () => {
    const text = elements.coverLetterContent.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Cover letter copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy. Please select and copy manually.', 'error');
    });
});

// ─────────────────────────────────────────────
// Mark as Applied
// ─────────────────────────────────────────────
elements.markApplied.addEventListener('change', async () => {
    if (!currentJobData) return;

    if (elements.markApplied.checked) {
        try {
            await sendApiRequest({
                action: 'saveJob',
                payload: {
                    jobTitle: currentJobData.jobTitle,
                    company: currentJobData.company,
                    jobUrl: currentJobData.jobUrl,
                    location: currentJobData.location,
                    salary: currentJobData.salary,
                    jobType: currentJobData.jobType,
                    status: 'applied',
                }
            });
            showToast('Job marked as applied!', 'success');
        } catch (err) {
            console.error('Save job error:', err);
            showToast('Failed to save job. Are you logged in?', 'error');
            elements.markApplied.checked = false;
        }
    }
});

// ─────────────────────────────────────────────
// Reload Job Details
// ─────────────────────────────────────────────
elements.reloadBtn.addEventListener('click', () => {
    elements.loadingState.style.display = 'flex';
    elements.jobInfoSection.style.display = 'none';
    elements.highlightsSection.style.display = 'none';
    elements.skillsSection.style.display = 'none';
    elements.qualificationsSection.style.display = 'none';

    window.parent.postMessage({ type: 'HIREAI_RELOAD_JOB' }, '*');

    showToast('Reloading job details...', 'success');
});

// ─────────────────────────────────────────────
// Edit Resume → Open dashboard
// ─────────────────────────────────────────────
elements.editResumeBtn.addEventListener('click', () => {
    window.open('http://localhost:5173/dashboard', '_blank');
});

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
