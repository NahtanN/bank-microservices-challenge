import { UserServiceInterface } from "@domain/user/service/user.service.interface";
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { AppEvents } from "@shared/events.shared";
import { CurrentUser } from "src/application/decorators/current_user.decorator";
import { UpdateUserDto } from "./dtos/update_user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { GetUserDocs } from "src/application/docs/user/get_user.docs";
import { GetUserByIdDocs } from "src/application/docs/user/get_user_by_id.docs";
import { UpdateUserDocs } from "src/application/docs/user/update_user.docs";
import { ProfilePictureDocs } from "src/application/docs/user/profile_picture.docs";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth()
@Controller({
  version: "1",
})
export class UserController {
  constructor(
    @Inject("UserServiceInterface")
    private readonly service: UserServiceInterface,
  ) {}

  @GetUserDocs()
  @Get()
  async getUser(@CurrentUser() id: string) {
    return this.service.getUser(id);
  }

  @GetUserByIdDocs()
  @Get(":id")
  async getUserById(@Param("id") id: string) {
    return this.service.getUser(id);
  }

  @UpdateUserDocs()
  @Patch()
  async updateUser(@CurrentUser() id: string, @Body() data: UpdateUserDto) {
    return this.service.updateUser(id, data);
  }

  @ProfilePictureDocs()
  @Patch("profile-picture")
  @UseInterceptors(FileInterceptor("file"))
  async updateProfilePicture(
    @CurrentUser() id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.updateProfilePicture(id, file);
  }
}
