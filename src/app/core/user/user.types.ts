export interface User
{
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    avatar?: string;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    farms:[];
    preferences: {
        layout: string;
        scheme: string;
    }

    roles?: RoleType[];
    cost_center_types?: any[];
}

export interface UserTypeRes {
    data: User;
}

export interface RoleType {
    id: number;
    name: string;
    guard_name: string;
    permissions: Permission[];
}

export interface Permission {
    id:         number;
    name:       string;
    guard_name: string;
}

export interface UserProfile {
    name: string;
    email: string;
    password?: string,
    password_confirm?: string,
}