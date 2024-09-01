import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationDto } from "../../../common/pagination/pagination-dto";

export class FindTutorialByDto extends PaginationDto {
    @ApiPropertyOptional()
    startDate?: Date;

    @ApiPropertyOptional()
    endDate?: Date;

    @ApiPropertyOptional()
    title?: string;
}
