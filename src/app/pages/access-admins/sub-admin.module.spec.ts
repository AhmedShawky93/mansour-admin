import { SubAdminModule } from './sub-admin.module';

describe('SubAdminModule', () => {
  let subAdminModule: SubAdminModule;

  beforeEach(() => {
    subAdminModule = new SubAdminModule();
  });

  it('should create an instance', () => {
    expect(subAdminModule).toBeTruthy();
  });
});
