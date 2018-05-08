import { TestBed, inject } from '@angular/core/testing';

import { PongService } from './pong.service';

describe('PongService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PongService]
    });
  });

  it('should be created', inject([PongService], (service: PongService) => {
    expect(service).toBeTruthy();
  }));
});
