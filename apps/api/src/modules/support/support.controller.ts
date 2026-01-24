import { Body, Controller, Post, SetMetadata } from "@nestjs/common";
import type {
  SupportContactRequest,
  SupportContactResponse,
} from "@papadata/shared";
import { IS_PUBLIC_KEY } from "../../common/firebase-auth.guard";
import { SupportService } from "./support.service";

@Controller("support")
@SetMetadata(IS_PUBLIC_KEY, true)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post("contact")
  submitContact(
    @Body() payload: SupportContactRequest,
  ): SupportContactResponse {
    return this.supportService.submitContact(payload);
  }
}
