import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1725292246534 implements MigrationInterface {
    name = 'Initial1725292246534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "content" text NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "isRead" boolean NOT NULL DEFAULT false, "sender_id" integer, "chat_id" integer, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chats" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."friend_requests_status_enum" AS ENUM('pending', 'accepted', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "friend_requests" ("id" SERIAL NOT NULL, "status" "public"."friend_requests_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "senderId" integer, "receiverId" integer, CONSTRAINT "PK_3827ba86ce64ecb4b90c92eeea6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "uid" character varying NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6e20ce1edf0678a09f1963f9587" UNIQUE ("uid"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chats_participants_users" ("chatsId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_8927abbb3526ba8390b651b4675" PRIMARY KEY ("chatsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b66415a2051b0c7cd1961bfbbf" ON "chats_participants_users" ("chatsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5771c3686b4165c67c8f810302" ON "chats_participants_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_7540635fef1922f0b156b9ef74f" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friend_requests" ADD CONSTRAINT "FK_da724334b35796722ad87d31884" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friend_requests" ADD CONSTRAINT "FK_97c256506348f9347b3a8a35629" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chats_participants_users" ADD CONSTRAINT "FK_b66415a2051b0c7cd1961bfbbf5" FOREIGN KEY ("chatsId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chats_participants_users" ADD CONSTRAINT "FK_5771c3686b4165c67c8f8103024" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chats_participants_users" DROP CONSTRAINT "FK_5771c3686b4165c67c8f8103024"`);
        await queryRunner.query(`ALTER TABLE "chats_participants_users" DROP CONSTRAINT "FK_b66415a2051b0c7cd1961bfbbf5"`);
        await queryRunner.query(`ALTER TABLE "friend_requests" DROP CONSTRAINT "FK_97c256506348f9347b3a8a35629"`);
        await queryRunner.query(`ALTER TABLE "friend_requests" DROP CONSTRAINT "FK_da724334b35796722ad87d31884"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_7540635fef1922f0b156b9ef74f"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5771c3686b4165c67c8f810302"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b66415a2051b0c7cd1961bfbbf"`);
        await queryRunner.query(`DROP TABLE "chats_participants_users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "friend_requests"`);
        await queryRunner.query(`DROP TYPE "public"."friend_requests_status_enum"`);
        await queryRunner.query(`DROP TABLE "chats"`);
        await queryRunner.query(`DROP TABLE "messages"`);
    }

}
