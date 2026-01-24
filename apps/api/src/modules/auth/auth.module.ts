import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { getApiConfig } from "../../common/config";

const getJwtSecret = () => {
  const secret = getApiConfig().auth.jwtSecret;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return secret;
};

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: getJwtSecret(),
        signOptions: {
          issuer: getApiConfig().auth.jwtIssuer,
          audience: getApiConfig().auth.jwtAudience,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, JwtAuthGuard, AuthService],
  exports: [PassportModule, JwtModule, JwtAuthGuard],
})
export class AuthModule {}
