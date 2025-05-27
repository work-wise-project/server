export interface IPreparationResult {
    interview_id: string;
    company_info: string;
    job_info: string;
    material_links: string[];
}

export type InterviewPreparationData = {
    jobLink: string;
    resumeText?: string | null;
    skillsList?: string[];
    education?: string[];
    workExperience?: string[];
    pointsToImprove?: string[];
    prevMaterialLinks?: string[];
};
