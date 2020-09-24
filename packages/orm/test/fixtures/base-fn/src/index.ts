import { FunctionHandler, FaaSContext } from '@midwayjs/faas';
import { Provide, Inject, Func } from '@midwayjs/decorator';
import { getRepository, InjectEntityModel, useEntityModel } from '../../../../src';
import { User } from './entity/user';
import { Repository } from 'typeorm';
import * as assert  from 'assert';

@Provide()
export class IndexHandler implements FunctionHandler {
  @Inject()
  ctx: FaaSContext;

  @Inject('orm:getRepository')
  getRepo: getRepository;

  @InjectEntityModel(User)
  userModel: Repository<User>;

  @Func('index.handler')
  async handler() {
    const repo: Repository<User> = this.getRepo(User);
    const u = new User();
    u.name = 'oneuser1';
    const uu = await repo.save(u);
    console.log('user one id = ', uu.id);
    const user = new User();
    user.id = 1;

    const users = await this.userModel.findAndCount(user);

    const userModel = useEntityModel(User);
    const newUsers = await userModel.findAndCount(user);

    assert.deepStrictEqual(users, newUsers);

    return 'hello world' + JSON.stringify(users);
  }
}
