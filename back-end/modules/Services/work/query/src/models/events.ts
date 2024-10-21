export interface IUserChanges{
    newLogin?: string;
    newEmail?: string;
    newPassword?: string;
    oldLogin: string;
    oldEmail: string;
    oldPassword: string;
}