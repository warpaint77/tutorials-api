import { ApiProperty } from "@nestjs/swagger";
import { IPaginationDto } from "./pagination-dto.interface";
import { Type } from "class-transformer";

export class PaginationDto implements IPaginationDto {
    @ApiProperty()
    @Type(() => Number)
    page: number;

    @Type(() => Number)
    @ApiProperty()
    take: number;
}
