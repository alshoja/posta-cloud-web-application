import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { StepFiveDto } from './dto/step-five.dto';
import { StepFourDto } from './dto/step-four.dto';
import { StepOneDto } from './dto/step-one.dto';
import { StepSixDto } from './dto/step-six.dto';
import { StepThreeDto } from './dto/step-three.dto';
import { StepTwoDto } from './dto/step-two.dto';
import { RecordsService } from './services/records.service';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { FindRecordsQueryDto } from './dto/find-records-query.dto';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post('step/one')
  @UseInterceptors(ClassSerializerInterceptor)
  createStepOne(@Body() stepOneDto: StepOneDto) {
    return this.recordsService.createStepOne(stepOneDto);
  }

  @Post('step/two/:recordsId')
  createStepTwo(
    @Body() stepTwoDto: StepTwoDto,
    @Param('recordsId', ParseIntPipe) recordsId: number,
  ) {
    return this.recordsService.createStepTwo(stepTwoDto, recordsId);
  }

  @Post('step/three/:recordsId')
  createStepThree(
    @Body() stepThreeDto: StepThreeDto,
    @Param('recordsId', ParseIntPipe) recordsId: number,
  ) {
    return this.recordsService.createStepThree(stepThreeDto, recordsId);
  }

  @Post('step/four/:recordsId')
  createStepFour(
    @Body() stepFourDto: StepFourDto,
    @Param('recordsId', ParseIntPipe) recordsId: number,
  ) {
    return this.recordsService.createStepFour(stepFourDto, recordsId);
  }

  @Post('step/five/:recordsId')
  createStepFive(
    @Body() stepFiveDto: StepFiveDto,
    @Param('recordsId', ParseIntPipe) recordsId: number,
  ) {
    return this.recordsService.createStepFive(stepFiveDto, recordsId);
  }

  @Post('step/six/:recordsId')
  createStepSix(
    @Body() stepSixDto: StepSixDto,
    @Param('recordsId', ParseIntPipe) recordsId: number,
  ) {
    return this.recordsService.createStepSix(stepSixDto, recordsId);
  }

  @Post('reopen/:id')
  @Roles(UserRole.ADMIN)
  reopen(@Param('id', ParseIntPipe) id: number) {
    return this.recordsService.reopen(id);
  }

  @Post(':id/documents/reembed')
  reembedDocuments(@Param('id', ParseIntPipe) id: number) {
    return this.recordsService.reembedDocuments(id);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Query() query: FindRecordsQueryDto) {
    return this.recordsService.findAll(
      query.search,
      query.page,
      query.limit,
      query.sortBy,
      query.sortOrder,
      query.status,
    );
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recordsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recordsService.remove(id);
  }
}
