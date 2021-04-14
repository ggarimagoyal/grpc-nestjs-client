import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
	url: 'localhost:5000',
    package: 'checkDivisibility',
    protoPath: join(__dirname, '../proto/check-divisibility.proto'),
  },
};