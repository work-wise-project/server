export interface IUser {
    _id?: string;
    email: string;
    name: string;
    profileImage: string;
    refreshToken?: string[];
}
