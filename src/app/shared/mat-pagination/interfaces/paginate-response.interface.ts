export interface PaginateResponseType {
    /**
     * Metadata
     */
    meta?: any;

    /**
     * Página actual
     */
    current_page?: number;
    /**
     * Lista de registros
     */
    data?: any[];
    /**
     * Primera página. URL de Endpoint
     */
    first_page_url?: string;
    /**
     * Desde qué pagina se comienza
     */
    from?: number;
    /**
     * Ultima página
     */
    last_page?: number;
    /**
     * Ultima página. URL de Endpoint
     */
    last_page_url?: string;
    /**
     * Siguiente página. URL de Endpoint
     */
    next_page_url?: string;
    /**
     * Ruta actual
     */
    path?: string;
    /**
     * Registros por página.
     */
    per_page?: string;
    /**
     * Página previa. URL de Endpoint
     */
    prev_page_url?: string;
    /**
     * Hasta qué página se está apuntando
     */
    to?: number;
    /**
     * Total de registros.
     */
    total?: number;
}