import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentDto } from './dto/document.dto';
import { UpdateFamilyDto } from './dto/family.dto';
import { UpdateIdentityDto } from './dto/identity.dto';
import { UpdateOccupationDto } from './dto/occupation.dto';
import { UpdateProfileDto } from './dto/personal.dto';
import { UpdatePolicyDto } from './dto/policy.dto';
import { RecordsService } from './records.service';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post('step/one')
  @UseInterceptors(ClassSerializerInterceptor)
  createStepOne(@Body() updateProfileDto: UpdateProfileDto) {
    return this.recordsService.createStepOne(updateProfileDto);
  }

  @Post('step/two/:recordsId')
  createStepTwo(
    @Body() updateIdentityDto: UpdateIdentityDto,
    @Param('recordsId') recordsId: number,
  ) {
    return this.recordsService.createStepTwo(updateIdentityDto, recordsId);
  }

  @Post('step/three/:recordsId')
  createStepThree(
    @Body() updateOccupationDto: UpdateOccupationDto,
    @Param('recordsId') recordsId: number,
  ) {
    return this.recordsService.createStepThree(updateOccupationDto, recordsId);
  }

  @Post('step/four/:recordsId')
  createStepFour(
    @Body() updateFamilyDto: UpdateFamilyDto,
    @Param('recordsId') recordsId: number,
  ) {
    return this.recordsService.createStepFour(updateFamilyDto, recordsId);
  }

  @Post('step/five/:recordsId')
  createStepFive(
    @Body() updatePolicyDto: UpdatePolicyDto[],
    @Param('recordsId') recordsId: number,
  ) {
    return this.recordsService.createStepFive(updatePolicyDto, recordsId);
  }

  @Post('step/six/:recordsId')
  createStepSix(
    @Body()
    updateDocumentDto: DocumentDto[],
    @Param('recordsId') recordsId: number,
  ) {
    return this.recordsService.createStepSix(updateDocumentDto, recordsId);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(
    @Query('search') search: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'firstName',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.recordsService.findAll(
      search,
      Number(page),
      Number(limit),
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordsService.remove(+id);
  }

  @Get('elastic/search')
  search(@Query('query') query: string) {
    return this.recordsService.searchRecords(query);
  }
}
