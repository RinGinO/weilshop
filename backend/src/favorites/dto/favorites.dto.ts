import { IsUUID } from 'class-validator';

export class AddToFavoritesDto {
  @IsUUID()
  productId: string;
}

export class RemoveFromFavoritesDto {
  @IsUUID()
  productId: string;
}

export class FavoritesQueryDto {
  page?: number = 1;
  limit?: number = 20;
}
