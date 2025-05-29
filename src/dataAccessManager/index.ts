import { getUserByEmail, getUserById, createUser, updateUser } from './usersRoutes';
import { getAllSkills } from './skillsRoutes';
import { uploadResume, getResume } from './resumeRoutes';
import { getInterviewPreparationData, getInterviewPreparation, saveInterviewPreparation } from './interviewRouter';

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
};
