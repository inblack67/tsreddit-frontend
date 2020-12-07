export interface LoginInterface
{
    email: string;
    password: string;
}

export interface RegisterInterface
{
    name: string;
    email: string;
    password: string;
}

export interface CreatePostInterface
{
    title: string;
    text: string;
}

export interface DisplayErrorProps
{
    message: String;
}