import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAdminUser1710304412542 implements MigrationInterface {
  name = 'SeedAdminUser1710304412542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public.users (name, email, password, roles) VALUES ('admin', 'admin@universosub.com.br', '$2b$10$TE2l9Ym2N.A7G.nW9DbnRuTjg4OM2DVTZBMP4Ih145Du2UeumGCna', 'admin');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM public.users WHERE email = 'admin@universosub.com.br'`,
    );
  }
}
