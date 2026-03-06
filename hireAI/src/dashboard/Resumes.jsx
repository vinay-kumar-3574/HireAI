import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, PenLine, FileText, Trash2, Loader2, CheckCircle2, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeAPI } from '../services/api';

export default function Resumes() {
    const [resumeName, setResumeName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [resumes, setResumes] = useState([]);
    const [loadingResumes, setLoadingResumes] = useState(true);
    const [dragActive, setDragActive] = useState(false);
    const [previewResume, setPreviewResume] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch user's resumes on mount
    const fetchResumes = useCallback(async () => {
        try {
            const data = await resumeAPI.getAll();
            setResumes(data.resumes || []);
        } catch (err) {
            console.error('Failed to fetch resumes:', err);
        } finally {
            setLoadingResumes(false);
        }
    }, []);

    useEffect(() => {
        fetchResumes();
    }, [fetchResumes]);

    // Close preview on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') setPreviewResume(null);
        };
        if (previewResume) {
            window.addEventListener('keydown', handleKey);
            return () => window.removeEventListener('keydown', handleKey);
        }
    }, [previewResume]);

    // Handle file selection
    const handleFileSelect = (file) => {
        if (!file) return;
        const ext = file.name.split('.').pop().toLowerCase();
        if (!['pdf', 'docx'].includes(ext)) {
            toast.error('Only PDF and DOCX files are supported.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be under 10 MB.');
            return;
        }
        setSelectedFile(file);
        toast.success(`Selected: ${file.name}`, { duration: 2000 });
    };

    // Drag & Drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    // Upload handler
    const handleUpload = async () => {
        if (!resumeName.trim()) {
            toast.error('Please enter a resume name.');
            return;
        }
        if (!selectedFile) {
            toast.error('Please select a file to upload.');
            return;
        }

        setUploading(true);
        try {
            const data = await resumeAPI.upload({ file: selectedFile, resumeName: resumeName.trim() });
            toast.success(data.message || 'Resume uploaded successfully! 🎉', { duration: 3500 });
            setResumeName('');
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            fetchResumes();
        } catch (err) {
            const message = err.response?.data?.error || 'Upload failed. Please try again.';
            toast.error(message);
        } finally {
            setUploading(false);
        }
    };

    // Delete handler
    const handleDelete = async (e, id, name) => {
        e.stopPropagation();
        try {
            await resumeAPI.delete(id);
            toast.success(`"${name}" deleted.`, { duration: 2500 });
            setResumes((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            toast.error('Failed to delete resume.');
        }
    };

    // Preview handler
    const handlePreview = (resume) => {
        setPreviewResume(resume);
    };

    // Format file size
    const formatSize = (bytes) => {
        if (!bytes) return '—';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Format date
    const formatDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    return (
        <div className="max-w-[760px] mx-auto px-8 py-12">

            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Create New Resume</h1>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 space-y-8">

                {/* Resume Name Input */}
                <div className="space-y-2">
                    <label className="text-[15px] font-semibold text-gray-900">
                        Resume Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={resumeName}
                        onChange={(e) => setResumeName(e.target.value)}
                        placeholder="e.g., Software Engineer Resume"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-400 text-[15px]"
                    />
                    <p className="text-xs text-gray-500">Please enter a name for your resume</p>
                </div>

                {/* Upload Dropzone */}
                <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors group bg-gray-50/50">

                    <div className="flex items-start gap-4 p-5 border-b border-gray-100 bg-white">
                        <div className="bg-[#fcfcfc] border border-gray-100 shadow-sm w-10 h-10 rounded-lg flex items-center justify-center text-black shrink-0">
                            <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-[16px] font-semibold text-gray-900">Upload Resume</h3>
                            <p className="text-sm text-gray-500">Upload your existing resume and we'll extract the information</p>
                        </div>
                    </div>

                    {/* Inner Drop Area */}
                    <div className="p-8 pb-10">
                        <div
                            className={`border border-dashed rounded-xl flex flex-col items-center justify-center py-10 transition-colors cursor-pointer ${dragActive
                                    ? 'border-black bg-gray-50'
                                    : selectedFile
                                        ? 'border-green-300 bg-green-50/50'
                                        : 'border-gray-300 bg-white group-hover:bg-[#fafaf9]'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept=".pdf,.docx"
                                onChange={(e) => handleFileSelect(e.target.files[0])}
                                className="hidden"
                            />

                            {selectedFile ? (
                                <>
                                    <CheckCircle2 className="w-10 h-10 text-green-500 mb-3" strokeWidth={1.5} />
                                    <p className="text-gray-900 font-medium text-[15px] text-center mb-1">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-gray-400 text-sm">{formatSize(selectedFile.size)}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFile(null);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                                    >
                                        <X className="w-3.5 h-3.5" /> Remove
                                    </button>
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="w-10 h-10 text-gray-400 mb-4" strokeWidth={1.5} />
                                    <p className="text-gray-600 font-medium text-[15px] text-center mb-1">
                                        Upload or drag and drop your resume
                                    </p>
                                    <p className="text-gray-400 text-sm">PDF, DOCX • Max 10 MB</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={uploading || !resumeName.trim() || !selectedFile}
                    className="w-full flex items-center justify-center gap-2 bg-[#050505] text-[#fcfcfc] px-4 py-[14px] rounded-xl text-[15.5px] font-[500] hover:bg-[#1a1a1a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-[18px] h-[18px] animate-spin" />
                            Uploading & Processing...
                        </>
                    ) : (
                        <>
                            <UploadCloud className="w-[18px] h-[18px]" />
                            Upload Resume
                        </>
                    )}
                </button>

                {/* Build from Scratch Option */}
                <div className="border border-gray-200 rounded-xl flex items-start gap-4 p-5 hover:border-gray-300 transition-colors cursor-pointer bg-white">
                    <div className="bg-[#fbfdfc] border border-gray-100 shadow-sm w-10 h-10 rounded-lg flex items-center justify-center text-black shrink-0">
                        <PenLine className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-[16px] font-semibold text-gray-900">Build from Scratch</h3>
                        <p className="text-sm text-gray-500">Start fresh and build your resume step by step</p>
                    </div>
                </div>

            </div>

            {/* Uploaded Resumes List */}
            <div className="mt-12">
                <h2 className="text-[20px] font-bold text-gray-900 tracking-tight mb-5">Your Resumes</h2>

                {loadingResumes ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        <span className="ml-3 text-gray-500 text-[15px]">Loading resumes...</span>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm py-14 text-center">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" strokeWidth={1.2} />
                        <p className="text-gray-500 text-[15px] font-medium">No resumes yet</p>
                        <p className="text-gray-400 text-sm mt-1">Upload your first resume above to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {resumes.map((resume) => (
                            <div
                                key={resume.id}
                                onClick={() => handlePreview(resume)}
                                className="bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-between p-5 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="bg-gray-50 border border-gray-100 w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 shrink-0 group-hover:bg-black group-hover:text-white group-hover:border-black transition-colors">
                                        <Eye className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[15px] font-semibold text-gray-900 truncate">
                                            {resume.resumeName}
                                        </p>
                                        <p className="text-[12.5px] text-gray-400 mt-0.5">
                                            {resume.fileName} • {formatSize(resume.fileSize)} • {formatDate(resume.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-4">
                                    <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md ${resume.fileType === 'pdf'
                                            ? 'bg-red-50 text-red-500'
                                            : 'bg-blue-50 text-blue-500'
                                        }`}>
                                        {resume.fileType}
                                    </span>
                                    <button
                                        onClick={(e) => handleDelete(e, resume.id, resume.resumeName)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                                        title="Delete resume"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            {previewResume && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 sm:p-8"
                    onClick={() => setPreviewResume(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: 'modalSlideIn 0.2s ease-out' }}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="min-w-0">
                                <h3 className="text-[16px] font-semibold text-gray-900 truncate">{previewResume.resumeName}</h3>
                                <p className="text-[12.5px] text-gray-400 mt-0.5">{previewResume.fileName} • {formatSize(previewResume.fileSize)}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <a
                                    href={resumeAPI.getDownloadUrl(previewResume.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-gray-600 hover:text-black transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                                >
                                    Open in new tab ↗
                                </a>
                                <button
                                    onClick={() => setPreviewResume(null)}
                                    className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-hidden bg-gray-50">
                            {previewResume.fileType === 'pdf' ? (
                                <iframe
                                    src={resumeAPI.getDownloadUrl(previewResume.id)}
                                    className="w-full h-full border-0"
                                    title={`Preview: ${previewResume.resumeName}`}
                                />
                            ) : (
                                <div className="p-8 h-full overflow-y-auto">
                                    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm max-w-2xl mx-auto">
                                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                            <FileText className="w-8 h-8 text-blue-500" />
                                            <div>
                                                <p className="font-semibold text-gray-900">{previewResume.fileName}</p>
                                                <p className="text-sm text-gray-400">DOCX Document</p>
                                            </div>
                                        </div>
                                        {previewResume.extractedText ? (
                                            <pre className="whitespace-pre-wrap text-[14px] text-gray-700 leading-relaxed font-sans">
                                                {previewResume.extractedText}
                                            </pre>
                                        ) : (
                                            <div className="text-center py-10">
                                                <p className="text-gray-400 text-[15px]">Preview not available for this file.</p>
                                                <a
                                                    href={resumeAPI.getDownloadUrl(previewResume.id)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block mt-4 text-sm font-medium text-white bg-black px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
                                                >
                                                    Download File
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <style>{`
                        @keyframes modalSlideIn {
                            from {
                                opacity: 0;
                                transform: translateY(12px) scale(0.97);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0) scale(1);
                            }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}
