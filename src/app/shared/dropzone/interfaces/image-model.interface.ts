export interface ImageModel extends File {
    id?: number;
    file_id?: number;
    model_type?: string;
    model_id?: number;
    type: string; // Es el type de la base de datos, no del archivo
    mimes: string;
    name: string;
    original_name?: string;
    deleted_at?: string;
    created_at?: string;
    updated_at?: string;
    link?: string;
    progress?: number;
}