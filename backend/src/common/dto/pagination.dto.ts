// TODO: Базовый DTO для пагинации
export class PaginationDto {
  page?: number = 1;
  limit?: number = 12;
}

// TODO: Базовый ответ для списков
export class PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  items: T[];
}
