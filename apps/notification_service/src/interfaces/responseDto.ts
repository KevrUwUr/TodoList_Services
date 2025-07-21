import { PaginationMetaDto } from 'common/dto/pagination_meta.dto';

export class ResponseDto<T> {
  message: string;
  data: T;
  statusCode: number;
  meta?: PaginationMetaDto;
}
