import { HealthCheck } from "@endpoints/HealthCheck";
import { createTestClient, TestClient } from "@tests/helpers/client";
import { createMockPrisma, MockPrisma } from "@tests/helpers/prisma_mock";
import { beforeEach, describe, expect, it } from "vitest";

describe("Health Check", () => {
  let client: TestClient;
  let mockPrisma: MockPrisma;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    client = createTestClient({
      prisma: mockPrisma,
    });
    client.get("/health", HealthCheck);
  });

  it("when the query of the database is successful, should return status ok", async () => {
    // Arrange
    mockPrisma.$queryRaw.mockResolvedValueOnce([{ "?column?": 1 }]);

    // Act
    const res = await client.request("/health", {}, {});
    const body = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(body).toEqual({
      status: "ok",
      environment: "unknown",
      timestamp: expect.any(String),
    });
    expect(mockPrisma.$queryRaw).toHaveBeenCalledTimes(1);
    expect(mockPrisma.$queryRaw).toHaveBeenCalledWith(["SELECT 1"]);
  });

  it("when the query of the database fails, should return status error", async () => {
    // Arrange
    mockPrisma.$queryRaw.mockRejectedValueOnce(new Error("Database query failed"));

    // Act
    const res = await client.request("/health", {}, {});
    const body = await res.json();

    // Assert
    expect(res.status).toBe(500);
    expect(body).toEqual({
      status: "error",
      environment: "unknown",
      timestamp: expect.any(String),
    });
    expect(mockPrisma.$queryRaw).toHaveBeenCalledTimes(1);
    expect(mockPrisma.$queryRaw).toHaveBeenCalledWith(["SELECT 1"]);
  });

  it("should return environment value from CURRENT_ENVIRONMENT", async () => {
    // Arrange
    const TEST_ENVIRONMENT = "test";

    // Act
    const res = await client.request(
      "/health",
      {},
      {
        CURRENT_ENVIRONMENT: TEST_ENVIRONMENT,
      },
    );
    const body = await res.json();

    // Assert
    expect(res.status).toBe(200);
    // @ts-ignore
    expect(body.environment).toBe(TEST_ENVIRONMENT);
  });
});
