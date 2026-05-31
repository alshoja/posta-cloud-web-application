import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1780245027185 implements MigrationInterface {
    name = 'Migrations1780245027185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."records_status_enum" AS ENUM('DRAFT', 'IN_PROGRESS', 'COMPLETED')`);
        await queryRunner.query(`ALTER TABLE "records" ADD "status" "public"."records_status_enum" NOT NULL DEFAULT 'DRAFT'`);
        await queryRunner.query(`ALTER TABLE "records" ADD "lastCompletedStep" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "records" ADD "completedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "records" DROP COLUMN "completedAt"`);
        await queryRunner.query(`ALTER TABLE "records" DROP COLUMN "lastCompletedStep"`);
        await queryRunner.query(`ALTER TABLE "records" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."records_status_enum"`);
    }

}
