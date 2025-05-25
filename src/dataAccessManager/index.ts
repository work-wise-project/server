import { getUserByEmail, getUserById, createUser, updateUser, updateRefreshTokensUser } from './usersRoutes';
import { getAllSkills } from './skillsRoutes';
import { uploadResume, getResume } from './resumeRoutes';

export default {
    getUserByEmail,
    getUserById,
    createUser,
    updateUser,
    getAllSkills,
    uploadResume,
    getResume,
    updateRefreshTokensUser,
};
