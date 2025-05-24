import { getUserByEmail, getUserById, createUser, updateUser } from './usersRoutes';
import { getAllSkills } from './skillsRoutes';
import { uploadResume, getResume } from './resumeRoutes';
import { getInterviewById, getInterviewPreparation, saveInterviewPreparation } from './interviewRouter';

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
};
