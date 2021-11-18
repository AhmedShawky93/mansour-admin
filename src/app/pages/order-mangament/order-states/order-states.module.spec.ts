import { OrderStatesModule } from "./order-states.module";

describe("OrderStatesModule", () => {
  let orderStatesModule: OrderStatesModule;

  beforeEach(() => {
    orderStatesModule = new OrderStatesModule();
  });

  it("should create an instance", () => {
    expect(orderStatesModule).toBeTruthy();
  });
});
