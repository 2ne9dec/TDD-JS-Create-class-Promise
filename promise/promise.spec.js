const VadimPromise = require("./promise");

describe("Vadim Promise: ", () => {
  let promise;
  let executorSpy;

  const successResult = 42;
  const errorResult = "Error";

  beforeEach(() => {
    executorSpy = jest.fn((resolve) => {
      setTimeout(() => {
        resolve(successResult);
      }, 150);
    });
    promise = new VadimPromise(executorSpy);
  });

  test("should exists and to be typeof functions", () => {
    expect(VadimPromise).toBeDefined();
    expect(typeof VadimPromise).toBe("function");
  });

  test("instance should have methods: then, have, finally", () => {
    expect(promise.then).toBeDefined();
    expect(promise.catch).toBeDefined();
    expect(promise.finally).not.toBeUndefined();
  });

  test("should call executor function", () => {
    expect(executorSpy).toHaveBeenCalled();
  });

  test("should get data in then block and do chain", async () => {
    const result = await promise.then((num) => num).then((num) => num * 2);
    expect(result).toBe(successResult * 2);
  });

  test("should catch error", () => {
    // Первым параметром resolve, но в этом тесте он не нужен, поэтому placeholder
    const errorExecutor = (_, reject) => {
      setTimeout(() => {
        reject(errorResult);
      }, 150);
    };
    const errorPromise = new VadimPromise(errorExecutor);

    return new Promise((resolve) => {
      errorPromise.catch((error) => {
        expect(error).toBe(errorResult);
        resolve();
      });
    });
  });

  test("should call finally method", async () => {
    const finallySpy = jest.fn(() => {});
    await promise.finally(finallySpy);

    expect(finallySpy).toHaveBeenCalled();
  });
});
