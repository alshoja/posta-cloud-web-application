import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRole1717260000000 implements MigrationInterface {
  name = 'AddUserRole1717260000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'USER')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER'`,
    );
    await queryRunner.query(
      `UPDATE "users" SET "role" = 'ADMIN' WHERE "username" = 'admin@example.com' OR "username" LIKE 'admin%@example.com'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
