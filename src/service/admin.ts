import { loginData } from "../types";
import db from "../entity";
import {
  comparePasswords,
  decodeAccessToken,
  encryptPassword,
  withTransaction,
} from "../lib";

export const findOneUser = async (email: string) => {
  const user = await db.admin.findOne({
    where: {
      email,
    },
  });

  return user;
};

export const login = async (body: loginData) => {
  const user = await db.admin.findOne({
    where: {
      email: body.email,
    },
  });

  if (!user) return user;

  const doPasswordsMatch = await comparePasswords(body.password, user.password);

  if (!doPasswordsMatch) return null;
  return user;
};

export const createAccount = async (body: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const password = await encryptPassword(body.password);
  return await withTransaction(async (transaction: any) => {
    return await db.admin.create({ ...body, password }, { transaction });
  });
};

export const updateAccount = async (body: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  id: string;
}) => {
  const existingAccount = await db.admin.findByPk(body.id);

  console.log("existingAccount.password = ", existingAccount.password);
  console.log("body.password = ", body.password);

  if (existingAccount.password !== body.password) {
    body.password = await encryptPassword(body.password);
  }

  return await withTransaction(async (transaction: any) => {
    return await db.admin.update(
      body,
      {
        where: {
          id: body.id,
        },
      },
      { transaction }
    );
  });
};

export const saveAccessToken = async (token: string, adminId: string) => {
  return await withTransaction(async (transaction: any) => {
    const result = await db.session.create({ adminId, token }, { transaction });
    return result;
  });
};

export const logout = async (token: string, adminId: string) => {
  return await withTransaction(async (transaction: any) => {
    const result = await db.session.destroy(
      {
        where: {
          token,
          adminId,
        },
      },
      { transaction }
    );

    return result;
  });
};

export const isAuthorizedUser = async (token: string, adminId: string) => {
  return db.session.findOne({
    where: {
      token,
      adminId,
    },
  });
};

export const authenticateUser = async (token: string) => {
  const payload = decodeAccessToken(token) as { email: string };
  const user = await findOneUser(payload.email);
  return user;
};

export const getAdminById = async (id: string) => {
  const admin = await db.admin.findByPk(id);
  return admin;
};
