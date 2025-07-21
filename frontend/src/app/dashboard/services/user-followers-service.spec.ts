import { TestBed } from '@angular/core/testing';

import { UserFollowersService } from './user-followers-service';

describe('UserFollowersService', () => {
  let service: UserFollowersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFollowersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
