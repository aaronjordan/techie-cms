import {
  Controller,
  Get,
  NotImplementedException,
  Param,
  Post,
} from '@nestjs/common';

@Controller()
export class ActController {
  @Post('/like/:context')
  async like(@Param() params) {
    const { context } = params;
    console.log(context);
    throw new NotImplementedException();
  }

  @Post('/comment/:context')
  async comment(@Param() params) {
    const { context } = params;
    console.log(context);
    throw new NotImplementedException();
  }

  @Get('/likes/:context')
  async getLikes(@Param() params) {
    const { context } = params;
    console.log(context);
    throw new NotImplementedException();
  }

  @Get('/comments/:context')
  async getComments(@Param() params) {
    const { context } = params;
    console.log(context);
    throw new NotImplementedException();
  }
}
