export interface AuthSignupModel {
    _id?: string;
    fname: string;
    lname: string;
    phone: number;
    gender: string;
    age?: number;
    email: string;
    pass: string;
}