import { TestBed, inject } from "@angular/core/testing";

import { OrderStatesService } from "./order-states.service";

describe("OrderStatesService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderStatesService],
    });
  });

  it("should be created", inject(
    [OrderStatesService],
    (service: OrderStatesService) => {
      expect(service).toBeTruthy();
    }
  ));
});
