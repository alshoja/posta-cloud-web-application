import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { UpdateIdentityDocumentDto } from './base/identity-document.dto';
import { UpdateIdentityDto } from './base/identity.dto';

export class StepTwoDto extends UpdateIdentityDto {
  @IsArray({ message: 'Identity documents must be an array.' })
  @ValidateNested({ each: true })
  @Type(() => UpdateIdentityDocumentDto)
  identityDocuments: UpdateIdentityDocumentDto[] = [];
}
