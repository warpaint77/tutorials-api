import { ApiProperty } from "@nestjs/swagger";

export class CreateTutorialDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    body: string;
}
