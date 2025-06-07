export interface IResumeAnalysisResult {
    general_review: string;
    strengths: string[];
    weaknesses: string[];
}

export interface IResumeFromDatabase {
    analysis?: IResumeAnalysisResult;
    spell_check?: string;
}
