export interface ResumeAnalysisResult {
    general_review: string;
    strengths: string[];
    weaknesses: string[];
}

export interface ResumeAnalysisWithSpellCheck {
    spellCheck: string;
    analysis: string;
}
