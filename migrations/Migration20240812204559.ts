import { Migration } from '@mikro-orm/migrations';

export class Migration20240812204559 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz null, "updated_at" timestamptz null, "email" varchar(255) not null, "password" varchar(255) not null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }

}
