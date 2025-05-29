import { getInterviewById, getInterviewPreparation, saveInterviewPreparation } from './interviewRouter';
import { getResume, uploadResume } from './resumeRoutes';
import { getAllSkills } from './skillsRoutes';
import { createUser, getUserByEmail, getUserById, updateRefreshTokensUser, updateUser } from './usersRoutes';

export default {
    getInterviewById,
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
};
