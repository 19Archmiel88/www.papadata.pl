declare module '@google-cloud/secret-manager' {
  export class SecretManagerServiceClient {
    addSecretVersion(params: { parent: string; payload: { data: Buffer } }): Promise<unknown>;
  }
}
