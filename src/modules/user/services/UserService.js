export default class UserService {
  constructor(context){
    this.context = context;
  }

  async create(userMeta){
    let User = this.context.models.User
    let user = new User(userMeta)
    await user.save()
    return user
  }

  async find(){
    let User = this.context.models.User
    return await User.find().exec()
  }
}