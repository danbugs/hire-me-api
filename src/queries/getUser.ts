import { getConnection } from "typeorm";

export const getUser = (userId: number) =>
    getConnection()
        .query(
            `SELECT * FROM "public"."user" WHERE id=$1 LIMIT 1`,
            [userId]
        ).then((x) => x[0]);
