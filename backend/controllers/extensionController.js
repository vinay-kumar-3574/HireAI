const { db } = require('../config/firebase');

const JOBS_COLLECTION = 'saved_jobs';

/**
 * Controller: tailorResume
 * Compares the user's resume text with the job description.
 * Returns ATS score, insights, and resume improvement suggestions.
 *
 * NOTE: This uses a rule-based analysis engine. For production,
 * integrate with an AI service (OpenAI, Gemini, etc.) for better results.
 */
const tailorResume = async (req, res) => {
    try {
        const { resumeText, jobDescription, jobTitle, company } = req.body;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({
                error: 'Both resume text and job description are required.',
            });
        }

        // ─── Keyword Analysis ───
        const resumeWords = extractKeywords(resumeText.toLowerCase());
        const jobWords = extractKeywords(jobDescription.toLowerCase());

        // Find matched and unmatched skills
        const commonSkills = [
            'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby',
            'php', 'swift', 'kotlin', 'scala', 'r', 'matlab',
            'react', 'angular', 'vue', 'next.js', 'node.js', 'express', 'django', 'flask',
            'spring', 'rails', 'laravel', 'fastapi', '.net',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
            'git', 'ci/cd', 'rest', 'graphql', 'grpc',
            'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
            'machine learning', 'deep learning', 'nlp', 'computer vision',
            'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn',
            'html', 'css', 'sass', 'tailwind', 'bootstrap',
            'linux', 'bash', 'shell', 'agile', 'scrum', 'jira',
            'firebase', 'supabase', 'microservices', 'system design',
            'data structures', 'algorithms', 'jwt', 'oauth', 'saml', 'rbac',
            'devops', 'cloud', 'pub/sub', 'sso',
        ];

        const jobSkills = commonSkills.filter(skill =>
            jobDescription.toLowerCase().includes(skill)
        );

        const matchedSkills = jobSkills.filter(skill =>
            resumeText.toLowerCase().includes(skill)
        );

        const unmatchedSkills = jobSkills.filter(skill =>
            !resumeText.toLowerCase().includes(skill)
        );

        // ─── ATS Score Calculation ───
        let score = 0;

        // Skill match (50% weight)
        const skillMatchRatio = jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 0;
        score += Math.round(skillMatchRatio * 50);

        // Keyword overlap (30% weight)
        const keywordOverlap = calculateKeywordOverlap(resumeWords, jobWords);
        score += Math.round(keywordOverlap * 30);

        // Job title match (10% weight)
        const titleMatch = jobTitle && resumeText.toLowerCase().includes(jobTitle.toLowerCase().split(' ').slice(0, 2).join(' '));
        if (titleMatch) score += 10;

        // Education keywords (10% weight)
        const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'computer science', 'engineering'];
        const jobRequiresEdu = educationKeywords.some(k => jobDescription.toLowerCase().includes(k));
        const resumeHasEdu = educationKeywords.some(k => resumeText.toLowerCase().includes(k));
        if (!jobRequiresEdu || resumeHasEdu) score += 10;

        score = Math.min(score, 100);

        // ─── Determine current role from resume ───
        const currentTitle = extractCurrentTitle(resumeText);
        const currentEducation = extractEducation(resumeText);
        const requiredEducation = extractRequiredEducation(jobDescription);

        // ─── Generate Suggestions ───
        const suggestions = generateSuggestions(resumeText, jobDescription, unmatchedSkills, jobTitle);

        // ─── Build Response ───
        return res.status(200).json({
            atsScore: score,
            insights: {
                jobTitleMatch: titleMatch ? true : false,
                currentTitle: currentTitle || 'Not detected',
                requiredTitle: jobTitle || 'Not specified',
                educationMatch: !jobRequiresEdu || resumeHasEdu,
                currentEducation: currentEducation || 'Not detected',
                requiredEducation: requiredEducation || 'Not specified',
                matchedSkills: matchedSkills.map(s => capitalize(s)),
                unmatchedSkills: unmatchedSkills.map(s => capitalize(s)),
            },
            suggestions,
        });

    } catch (error) {
        console.error('Tailor resume error:', error);
        return res.status(500).json({ error: 'Failed to analyze resume. Please try again.' });
    }
};

/**
 * Controller: generateCoverLetter
 * Generates a cover letter based on resume + job description.
 *
 * NOTE: This uses a template-based approach. For production,
 * integrate with an AI service for personalized letters.
 */
const generateCoverLetter = async (req, res) => {
    try {
        const { resumeText, jobDescription, jobTitle, company } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required.' });
        }

        // Extract key info
        const skills = extractTopSkills(resumeText, jobDescription);
        const candidateName = extractName(resumeText);

        // Generate cover letter
        const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        const coverLetter = `${today}

Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle || 'position'} at ${company || 'your company'}. After reviewing the job description, I am confident that my skills and experience align well with the requirements.

${skills.length > 0 ? `My technical background includes expertise in ${skills.slice(0, 5).join(', ')}, which directly maps to the requirements outlined in the job description.` : 'My diverse technical background and proven ability to deliver results make me a strong candidate for this role.'}

${resumeText ? `Throughout my career, I have developed a strong foundation in software development, with hands-on experience building scalable applications and collaborating with cross-functional teams. I am passionate about leveraging technology to solve complex problems and drive innovation.` : ''}

I am particularly drawn to ${company || 'your organization'} because of its commitment to innovation and the opportunity to work on impactful projects. I believe my combination of technical skills and collaborative approach would make me a valuable addition to your team.

I would welcome the opportunity to discuss how my background and enthusiasm align with your needs. Thank you for considering my application.

Best regards,
${candidateName || '[Your Name]'}`;

        return res.status(200).json({ coverLetter });

    } catch (error) {
        console.error('Cover letter error:', error);
        return res.status(500).json({ error: 'Failed to generate cover letter.' });
    }
};

/**
 * Controller: saveJob
 * Saves a job application to the user's saved jobs collection.
 */
const saveJob = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated.' });
        }

        const { jobTitle, company, jobUrl, status, location, salary, jobType } = req.body;

        if (!jobTitle || !company) {
            return res.status(400).json({ error: 'Job title and company are required.' });
        }

        // Check if already saved
        const existing = await db.collection(JOBS_COLLECTION)
            .where('userId', '==', userId)
            .where('jobUrl', '==', jobUrl)
            .limit(1)
            .get();

        if (!existing.empty) {
            // Update existing
            const docId = existing.docs[0].id;
            await db.collection(JOBS_COLLECTION).doc(docId).update({
                status: status || 'applied',
                updatedAt: new Date().toISOString(),
            });
            return res.status(200).json({ message: 'Job updated successfully.', id: docId });
        }

        // Create new saved job
        const data = {
            userId,
            jobTitle,
            company,
            jobUrl: jobUrl || '',
            location: location || '',
            salary: salary || '',
            jobType: jobType || '',
            status: status || 'saved',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const ref = await db.collection(JOBS_COLLECTION).add(data);

        return res.status(201).json({
            message: 'Job saved successfully.',
            id: ref.id,
            ...data,
        });

    } catch (error) {
        console.error('Save job error:', error);
        return res.status(500).json({ error: 'Failed to save job.' });
    }
};

// ─── Helper Functions ───

function extractKeywords(text) {
    return text
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2)
        .reduce((acc, word) => {
            acc[word] = (acc[word] || 0) + 1;
            return acc;
        }, {});
}

function calculateKeywordOverlap(resumeWords, jobWords) {
    const jobKeys = Object.keys(jobWords);
    if (jobKeys.length === 0) return 0;

    const stopWords = new Set([
        'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
        'her', 'was', 'one', 'our', 'out', 'has', 'have', 'been', 'will', 'with',
        'this', 'that', 'from', 'they', 'been', 'would', 'each', 'make', 'like',
        'long', 'look', 'many', 'them', 'than', 'first', 'also', 'just', 'about',
    ]);

    const significantJobKeys = jobKeys.filter(k => !stopWords.has(k) && k.length > 3);
    if (significantJobKeys.length === 0) return 0;

    const matched = significantJobKeys.filter(k => resumeWords[k]);
    return matched.length / significantJobKeys.length;
}

function extractCurrentTitle(text) {
    const lines = text.split('\n');
    const titleKeywords = ['developer', 'engineer', 'designer', 'manager', 'analyst', 'consultant', 'intern', 'lead', 'architect', 'administrator'];

    for (const line of lines.slice(0, 10)) {
        const trimmed = line.trim();
        if (titleKeywords.some(k => trimmed.toLowerCase().includes(k)) && trimmed.length < 100) {
            return trimmed;
        }
    }
    return '';
}

function extractEducation(text) {
    const patterns = [
        /(?:bachelor|master|phd|doctorate|associate)(?:'s)?\s+(?:of\s+)?(?:science|arts|engineering|technology)\s+(?:in\s+)?[\w\s]+/gi,
        /(?:B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|Ph\.?D\.?)\s+(?:in\s+)?[\w\s]+/g,
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[0].trim();
    }
    return '';
}

function extractRequiredEducation(text) {
    const lines = text.split('\n');
    for (const line of lines) {
        if (/bachelor|master|degree|phd/i.test(line) && /require|prefer|pursuing/i.test(line)) {
            return line.trim().substring(0, 150);
        }
    }

    for (const line of lines) {
        if (/bachelor|master|degree/i.test(line) && line.trim().length < 200) {
            return line.trim();
        }
    }
    return '';
}

function extractTopSkills(resumeText, jobDescription) {
    const commonSkills = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js',
        'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'Git',
        'Machine Learning', 'REST APIs', 'GraphQL', 'Angular', 'Vue',
    ];

    return commonSkills.filter(skill =>
        resumeText.toLowerCase().includes(skill.toLowerCase()) &&
        jobDescription.toLowerCase().includes(skill.toLowerCase())
    );
}

function extractName(text) {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length > 0) {
        const firstLine = lines[0].trim();
        // Check if it looks like a name (2-4 words, no special characters)
        if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+){0,3}$/.test(firstLine) && firstLine.length < 50) {
            return firstLine;
        }
    }
    return '';
}

function generateSuggestions(resumeText, jobDescription, unmatchedSkills, jobTitle) {
    const suggestions = [];

    // Suggest adding missing skills
    if (unmatchedSkills.length > 0) {
        const relevantExisting = extractExistingSkillSection(resumeText);
        const missingFormatted = unmatchedSkills.slice(0, 5).map(s => capitalize(s)).join(', ');

        suggestions.push({
            category: 'Skills Enhancement',
            original: relevantExisting || 'Current skills section',
            improved: `${relevantExisting ? relevantExisting + ', ' : ''}${missingFormatted}`,
        });
    }

    // Suggest job title alignment
    if (jobTitle) {
        const currentTitle = extractCurrentTitle(resumeText);
        if (currentTitle && !currentTitle.toLowerCase().includes(jobTitle.toLowerCase().split(' ')[0])) {
            suggestions.push({
                category: 'Job Title Alignment',
                original: currentTitle,
                improved: `${currentTitle} | ${jobTitle} (Targeted)`,
            });
        }
    }

    // Suggest adding action keywords from JD
    const actionKeywords = ['led', 'developed', 'implemented', 'designed', 'optimized', 'managed', 'built', 'created', 'scaled', 'automated'];
    const jobActions = actionKeywords.filter(k => jobDescription.toLowerCase().includes(k));
    const resumeActions = actionKeywords.filter(k => resumeText.toLowerCase().includes(k));
    const missingActions = jobActions.filter(k => !resumeActions.includes(k));

    if (missingActions.length > 0) {
        suggestions.push({
            category: 'Action Verbs',
            original: 'Consider using stronger action verbs',
            improved: `Add power verbs like: ${missingActions.slice(0, 4).map(a => capitalize(a)).join(', ')} to strengthen your experience descriptions`,
        });
    }

    // Suggest quantifying achievements
    const hasNumbers = /\d+%|\$\d+|\d+ users|\d+ team|\d+x/i.test(resumeText);
    if (!hasNumbers) {
        suggestions.push({
            category: 'Quantify Impact',
            original: 'Experience descriptions lack metrics',
            improved: 'Add quantifiable achievements (e.g., "Improved performance by 40%", "Served 10K+ users", "Led a team of 5")',
        });
    }

    return suggestions;
}

function extractExistingSkillSection(text) {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (/skills|technologies|tech stack/i.test(lines[i])) {
            const nextLine = lines[i + 1] || '';
            if (nextLine.trim().length > 10) {
                return nextLine.trim().substring(0, 100);
            }
        }
    }
    return '';
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { tailorResume, generateCoverLetter, saveJob };
