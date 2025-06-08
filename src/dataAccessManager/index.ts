import { getInterviewPreparation, getInterviewPreparationData, saveInterviewPreparation } from './interviewRouter';
import {
    getResume,
    uploadResume,
    getResumeAnalysis,
    getResumeSpellCheck,
    saveResumeAnalysis,
    saveResumeSpellCheck,
} from './resumeRoutes';
import { getAllSkills } from './skillsRoutes';
import { createUser, getUserByEmail, getUserById, updateRefreshTokensUser, updateUser } from './usersRoutes';

export default {
    getInterviewPreparationData,
    getInterviewPreparation,
    saveInterviewPreparation,
    getUserByEmail,
    getUserById,
    createUser,
    updateUser,
    getAllSkills,
    uploadResume,
    getResume,
    updateRefreshTokensUser,
    getResumeAnalysis,
    getResumeSpellCheck,
    saveResumeAnalysis,
    saveResumeSpellCheck,
};
