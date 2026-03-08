/**
 * HireAI Chrome Extension - Content Script
 * Injected into job pages. Handles:
 *  - Sidebar injection/toggle
 *  - Job description extraction via MutationObserver
 *  - URL change detection for SPAs
 *  - Communication between page and sidebar iframe
 */

(() => {
    // Prevent double injection
    if (window.__hireai_injected) return;
    window.__hireai_injected = true;

    const SIDEBAR_WIDTH = 380;
    let sidebarVisible = false;
    let sidebarFrame = null;
    let sidebarContainer = null;

    // ─────────────────────────────────────────────
    // Sidebar Injection
    // ─────────────────────────────────────────────
    function createSidebar() {
        if (sidebarContainer) return;

        // Container
        sidebarContainer = document.createElement('div');
        sidebarContainer.id = 'hireai-sidebar-container';
        sidebarContainer.style.cssText = `
      position: fixed;
      top: 0;
      right: -${SIDEBAR_WIDTH}px;
      width: ${SIDEBAR_WIDTH}px;
      height: 100vh;
      z-index: 2147483647;
      transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
      border-left: 1px solid rgba(0,0,0,0.06);
    `;

        // Iframe for sidebar content (isolated styles)
        sidebarFrame = document.createElement('iframe');
        sidebarFrame.id = 'hireai-sidebar-frame';
        sidebarFrame.src = chrome.runtime.getURL('sidebar.html');
        sidebarFrame.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background: #ffffff;
    `;
        sidebarFrame.setAttribute('allow', 'clipboard-write');

        sidebarContainer.appendChild(sidebarFrame);
        document.body.appendChild(sidebarContainer);

        // Wait for iframe to load then send job data
        sidebarFrame.addEventListener('load', () => {
            setTimeout(() => {
                extractAndSendJobData();
            }, 800);
        });
    }

    function showSidebar() {
        if (!sidebarContainer) createSidebar();
        sidebarContainer.style.right = '0px';
        document.body.style.transition = 'margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        document.body.style.marginRight = `${SIDEBAR_WIDTH}px`;
        document.body.style.overflow = 'auto';
        sidebarVisible = true;

        // Store state
        chrome.storage.local.set({ sidebarVisible: true });
    }

    function hideSidebar() {
        if (!sidebarContainer) return;
        sidebarContainer.style.right = `-${SIDEBAR_WIDTH}px`;
        document.body.style.marginRight = '0px';
        sidebarVisible = false;

        chrome.storage.local.set({ sidebarVisible: false });
    }

    function toggleSidebar() {
        if (sidebarVisible) {
            hideSidebar();
        } else {
            showSidebar();
        }
    }

    // ─────────────────────────────────────────────
    // Job Description Extraction
    // ─────────────────────────────────────────────

    /**
     * Site-specific extraction rules
     */
    const siteExtractors = {
        'linkedin.com': {
            jobTitle: () => {
                const el = document.querySelector('.job-details-jobs-unified-top-card__job-title, .top-card-layout__title, h1.topcard__title, h1');
                return el ? el.innerText.trim() : '';
            },
            company: () => {
                const el = document.querySelector('.job-details-jobs-unified-top-card__company-name a, .topcard__org-name-link, a.topcard__org-name-link');
                return el ? el.innerText.trim() : '';
            },
            location: () => {
                const el = document.querySelector('.job-details-jobs-unified-top-card__bullet, .topcard__flavor--bullet');
                return el ? el.innerText.trim() : '';
            },
            description: () => {
                const el = document.querySelector('.jobs-description__content, .description__text, .show-more-less-html__markup');
                return el ? el.innerText.trim() : '';
            },
        },

        'github.com': {
            jobTitle: () => {
                const el = document.querySelector('h1, .job-title, [data-testid="job-title"]');
                return el ? el.innerText.trim() : '';
            },
            company: () => {
                // GitHub careers usually shows GitHub as company
                return 'GitHub';
            },
            location: () => {
                const locationEl = Array.from(document.querySelectorAll('dt, .job-detail-label')).find(el =>
                    el.innerText.toLowerCase().includes('location')
                );
                if (locationEl) {
                    const dd = locationEl.nextElementSibling;
                    return dd ? dd.innerText.trim() : '';
                }
                return '';
            },
            description: () => {
                const el = document.querySelector('.job-post-description, .job-description, main, article');
                return el ? el.innerText.trim() : '';
            },
        },

        'indeed.com': {
            jobTitle: () => {
                const el = document.querySelector('.jobsearch-JobInfoHeader-title, h1.icl-u-xs-mb--xs, h1');
                return el ? el.innerText.trim() : '';
            },
            company: () => {
                const el = document.querySelector('[data-company-name] a, .icl-u-lg-mr--sm, .jobsearch-InlineCompanyRating a');
                return el ? el.innerText.trim() : '';
            },
            location: () => {
                const el = document.querySelector('.jobsearch-JobInfoHeader-subtitle .icl-u-xs-mt--xs, [data-testid="job-location"]');
                return el ? el.innerText.trim() : '';
            },
            description: () => {
                const el = document.querySelector('#jobDescriptionText, .jobsearch-jobDescriptionText');
                return el ? el.innerText.trim() : '';
            },
        },

        'greenhouse.io': {
            jobTitle: () => {
                const el = document.querySelector('.app-title, h1');
                return el ? el.innerText.trim() : '';
            },
            company: () => {
                const el = document.querySelector('.company-name');
                return el ? el.innerText.trim() : '';
            },
            location: () => {
                const el = document.querySelector('.location');
                return el ? el.innerText.trim() : '';
            },
            description: () => {
                const el = document.querySelector('#content, .content');
                return el ? el.innerText.trim() : '';
            },
        },

        'lever.co': {
            jobTitle: () => {
                const el = document.querySelector('.posting-headline h2, h1, h2');
                return el ? el.innerText.trim() : '';
            },
            company: () => {
                const el = document.querySelector('.posting-headline .sort-by-time, .main-header-logo img');
                if (el && el.alt) return el.alt;
                return document.title.split(' - ')[1] || '';
            },
            location: () => {
                const el = document.querySelector('.posting-categories .sort-by-time, .location');
                return el ? el.innerText.trim() : '';
            },
            description: () => {
                const el = document.querySelector('.posting-page .content, .section-wrapper');
                return el ? el.innerText.trim() : '';
            },
        },
    };

    /**
     * Generic fallback extractor
     */
    const genericExtractor = {
        jobTitle: () => {
            const h1 = document.querySelector('h1');
            return h1 ? h1.innerText.trim() : document.title;
        },
        company: () => {
            // Try meta tags
            const meta = document.querySelector('meta[property="og:site_name"]');
            if (meta) return meta.getAttribute('content') || '';

            // Try common patterns
            const el = document.querySelector('[class*="company"], [data-company], .employer-name');
            return el ? el.innerText.trim() : '';
        },
        location: () => {
            const el = document.querySelector('[class*="location"], [data-location]');
            return el ? el.innerText.trim() : '';
        },
        description: () => {
            // Try common job description containers
            const selectors = [
                '.job-description',
                '.jobDescriptionText',
                '#job-description',
                '[class*="description"]',
                'article',
                'main',
                '.content',
            ];
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el && el.innerText.trim().length > 100) {
                    return el.innerText.trim();
                }
            }
            return document.body.innerText.substring(0, 5000);
        },
    };

    function getSiteExtractor() {
        const host = window.location.hostname;
        for (const [domain, extractor] of Object.entries(siteExtractors)) {
            if (host.includes(domain)) {
                return extractor;
            }
        }
        return genericExtractor;
    }

    function extractJobData() {
        const extractor = getSiteExtractor();
        const description = extractor.description();

        // Parse additional info from description
        const skills = extractSkills(description);
        const qualifications = extractQualifications(description);
        const highlights = extractHighlights(description);
        const salary = extractSalary(description);
        const jobType = extractJobType(description);

        return {
            jobTitle: extractor.jobTitle(),
            company: extractor.company(),
            location: extractor.location(),
            description: description,
            skills,
            qualifications,
            highlights,
            salary,
            jobType,
            jobUrl: window.location.href,
            extractedAt: new Date().toISOString(),
        };
    }

    function extractSkills(text) {
        const commonSkills = [
            'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'Go', 'Rust', 'Ruby',
            'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB',
            'React', 'Angular', 'Vue', 'Next\\.js', 'Node\\.js', 'Express', 'Django', 'Flask',
            'Spring', 'Rails', 'Laravel', 'FastAPI', '.NET',
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins',
            'Git', 'CI/CD', 'REST', 'GraphQL', 'gRPC',
            'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
            'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
            'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn',
            'HTML', 'CSS', 'Sass', 'Tailwind', 'Bootstrap',
            'Linux', 'Bash', 'Shell',
            'Agile', 'Scrum', 'Jira',
            'Firebase', 'Supabase', 'Vercel', 'Netlify',
            'REST APIs', 'Microservices', 'System Design',
            'Data Structures', 'Algorithms',
        ];

        const found = [];
        for (const skill of commonSkills) {
            const regex = new RegExp(`\\b${skill}\\b`, 'i');
            if (regex.test(text)) {
                // Get the original case version
                const match = text.match(regex);
                if (match) found.push(match[0]);
            }
        }
        // Deduplicate
        return [...new Set(found)];
    }

    function extractQualifications(text) {
        const qualifications = [];
        const lines = text.split('\n');
        let inQualSection = false;

        for (const line of lines) {
            const trimmed = line.trim();
            if (/qualif|requirement|what you('ll)? need|who you are|must have|minimum/i.test(trimmed)) {
                inQualSection = true;
                continue;
            }
            if (inQualSection) {
                if (/^(responsibility|what you('ll)? do|about |benefit|perk|nice to have|preferred)/i.test(trimmed)) {
                    inQualSection = false;
                    continue;
                }
                if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
                    const clean = trimmed.replace(/^[•\-*]\s*/, '').replace(/^\d+\.\s*/, '');
                    if (clean.length > 10 && clean.length < 300) {
                        qualifications.push(clean);
                    }
                }
            }
        }
        return qualifications.slice(0, 8);
    }

    function extractHighlights(text) {
        const highlights = [];
        const patterns = [
            /remote/i,
            /hybrid/i,
            /on-?site/i,
            /\d+[\s-]week/i,
            /internship/i,
            /full[\s-]time/i,
            /part[\s-]time/i,
            /contract/i,
            /competitive\s+(?:salary|compensation|pay)/i,
            /equity|stock\s+options/i,
            /health\s+(?:insurance|benefits)/i,
            /401k|retirement/i,
            /visa\s+sponsorship/i,
            /relocation/i,
        ];

        const lines = text.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            for (const pattern of patterns) {
                if (pattern.test(trimmed) && trimmed.length < 200) {
                    const clean = trimmed.replace(/^[•\-*]\s*/, '');
                    if (clean.length > 5 && !highlights.includes(clean)) {
                        highlights.push(clean);
                    }
                    break;
                }
            }
        }
        return highlights.slice(0, 6);
    }

    function extractSalary(text) {
        const salaryPattern = /\$[\d,]+(?:\.\d{2})?\s*[-–to]+\s*\$[\d,]+(?:\.\d{2})?(?:\s*\/?\s*(?:year|yr|hour|hr|month|mo|annually|per\s+hour|per\s+year))?/gi;
        const match = text.match(salaryPattern);
        if (match) return match[0];

        const simplePattern = /(?:salary|compensation|pay)[\s:]*\$[\d,]+/gi;
        const simpleMatch = text.match(simplePattern);
        if (simpleMatch) return simpleMatch[0].replace(/(?:salary|compensation|pay)[\s:]*/i, '');

        return '';
    }

    function extractJobType(text) {
        if (/\binternship\b/i.test(text)) return 'Internship';
        if (/\bcontract\b/i.test(text)) return 'Contract';
        if (/\bpart[\s-]time\b/i.test(text)) return 'Part-time';
        if (/\bfull[\s-]time\b/i.test(text)) return 'Full-time';
        if (/\bfreelance\b/i.test(text)) return 'Freelance';
        return 'Full-time';
    }

    function extractAndSendJobData() {
        try {
            const jobData = extractJobData();
            if (sidebarFrame && sidebarFrame.contentWindow) {
                sidebarFrame.contentWindow.postMessage({
                    type: 'HIREAI_JOB_DATA',
                    data: jobData,
                }, '*');
            }
        } catch (err) {
            console.error('HireAI: Error extracting job data:', err);
        }
    }

    // ─────────────────────────────────────────────
    // MutationObserver for dynamic content
    // ─────────────────────────────────────────────
    let extractionTimeout = null;

    const observer = new MutationObserver(() => {
        if (!sidebarVisible) return;

        // Debounce extraction
        if (extractionTimeout) clearTimeout(extractionTimeout);
        extractionTimeout = setTimeout(() => {
            extractAndSendJobData();
        }, 1500);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // ─────────────────────────────────────────────
    // URL change detection (for SPAs)
    // ─────────────────────────────────────────────
    let lastUrl = location.href;

    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (sidebarVisible) {
                setTimeout(() => {
                    extractAndSendJobData();
                }, 2000);
            }
        }
    }).observe(document, { subtree: true, childList: true });

    // ─────────────────────────────────────────────
    // Message listener from background/popup
    // ─────────────────────────────────────────────
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'toggleSidebar') {
            toggleSidebar();
            sendResponse({ success: true, visible: sidebarVisible });
        }

        if (message.action === 'showSidebar') {
            showSidebar();
            sendResponse({ success: true });
        }

        if (message.action === 'extractJobData') {
            const jobData = extractJobData();
            sendResponse({ success: true, data: jobData });
        }

        if (message.action === 'reloadJobDetails') {
            extractAndSendJobData();
            sendResponse({ success: true });
        }
    });

    // Listen for messages from sidebar iframe
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'HIREAI_RELOAD_JOB') {
            extractAndSendJobData();
        }

        if (event.data && event.data.type === 'HIREAI_CLOSE_SIDEBAR') {
            hideSidebar();
        }

        // Forward API requests from sidebar to background
        if (event.data && event.data.type === 'HIREAI_API_REQUEST') {
            chrome.runtime.sendMessage(event.data.payload, (response) => {
                if (sidebarFrame && sidebarFrame.contentWindow) {
                    sidebarFrame.contentWindow.postMessage({
                        type: 'HIREAI_API_RESPONSE',
                        requestId: event.data.requestId,
                        response: response,
                    }, '*');
                }
            });
        }
    });

    // ─────────────────────────────────────────────
    // Auto-show sidebar if was previously visible
    // ─────────────────────────────────────────────
    chrome.storage.local.get(['sidebarVisible'], (result) => {
        if (result.sidebarVisible) {
            showSidebar();
        }
    });
})();
