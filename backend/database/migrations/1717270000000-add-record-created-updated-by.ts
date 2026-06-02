import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRecordCreatedUpdatedBy1717270000000
  implements MigrationInterface
{
  name = 'AddRecordCreatedUpdatedBy1717270000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "records" ADD "createdBy" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "records" ADD "updatedBy" integer`,
    );
    await queryRunner.query(
      `UPDATE "records" SET "createdBy" = "userId" WHERE "createdBy" IS NULL`,
    );
    await queryRunner.query(
      `UPDATE "records" SET "updatedBy" = "userId" WHERE "updatedBy" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "records" ALTER COLUMN "createdBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "records" ALTER COLUMN "updatedBy" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "records" DROP COLUMN "updatedBy"`);
    await queryRunner.query(`ALTER TABLE "records" DROP COLUMN "createdBy"`);
  }
}
