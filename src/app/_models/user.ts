import { Photo } from './photo';

export interface User {
    id: number;
    token: string;
    publicKey: string;
    username: string;
    photoUrl: string;
    photos?: Photo[];
    activeChats: User[];
}
