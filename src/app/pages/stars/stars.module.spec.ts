import { StarsModule } from './stars.module';

describe('StarsModule', () => {
  let starsModule: StarsModule;

  beforeEach(() => {
    starsModule = new StarsModule();
  });

  it('should create an instance', () => {
    expect(starsModule).toBeTruthy();
  });
});
