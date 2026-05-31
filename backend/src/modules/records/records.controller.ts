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
import { RecordsService } from './records.service';

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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recordsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recordsService.remove(id);
  }
}
