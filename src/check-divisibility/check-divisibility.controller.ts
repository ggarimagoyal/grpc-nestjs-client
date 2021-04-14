import { Controller, Inject, OnModuleInit, Post, Body } from '@nestjs/common';
import { ClientGrpc, GrpcMethod, GrpcStreamCall, GrpcStreamMethod } from '@nestjs/microservices';
import { RequestParams } from './interfaces/request-params.interface';
import { BinaryStream } from './interfaces/binary-stream.interface';
import { ResponseObjectSuccess, ResponseObjectError } from './interfaces/response-object.interface';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { CheckDivisibilityService } from './interfaces/check-divisibility-service.interface';

@Controller('/checkDivisibility')
export class CheckDivisibilityController implements OnModuleInit {

	private checkDivisibilityService: CheckDivisibilityService;

	constructor(@Inject('CHECK_DIVISIBILITY_PACKAGE') private readonly client: ClientGrpc) { }

	onModuleInit() {
		this.checkDivisibilityService = this.client.getService<CheckDivisibilityService>('CheckDivisibilityService');
	}

	@Post('check')
	checkDivisibility(@Body() data: RequestParams) {
		return this.checkDivisibilityService.checkDivisibility(data);
	}

	@GrpcStreamCall()
	checkBinaryStream(requestStream: any) {
		requestStream.on('data', message => {
			console.log(message);
		});

		requestStream.on('error', message => {
			console.log("error", message);
		});
	}

	@Post('binarystream')
	checkBinaryStreamPost() {
		const binaryRequest = new ReplaySubject<BinaryStream>();
		binaryRequest.next({ n: true, divisor: 2 });
		binaryRequest.next({ n: false, divisor: 3 });
		binaryRequest.next({ n: true, divisor: 3 });
		binaryRequest.next({ n: true, divisor: 3 });
		binaryRequest.next({ n: false, divisor: 3 });
		binaryRequest.complete();
		return this.checkDivisibilityService.checkBinaryStream(binaryRequest);
	}
}