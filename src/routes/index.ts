/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as moment from 'moment';

import { UserModel } from '../models/user';

const userModel = new UserModel();

const router = (fastify, { }, next) => {

  var db: Knex = fastify.db;

  fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
    console.log(db);
    reply.send({ date: moment(),db });
  })

  fastify.get('/sign-token', async (req: Request, reply: fastify.Reply) => {
    const token = fastify.jwt.sign({ foo: 'bar' }, { expiresIn: '1d' });
    reply.send({ token: token });
  })

  fastify.get('/test-db', {
    preHandler: [fastify.authenticate]
  }, async (req: fastify.Request, reply: fastify.Reply) => {
    console.log(req.user);
    try {
      var rs = await userModel.getUser(db);
      reply.code(200).send({ ok: true, rows: rs });
    } catch (error) {
      req.log.error(error);
      reply.code(500).send({ ok: false, error: error.message });
    }
  });

  next();

}

module.exports = router;