import { DeviceOperatingSystem, DeviceType, LoginActivity, UserDevice } from "@prisma/client";
import { AppContext } from "index";
import { UAParser } from "ua-parser-js";

export class DeviceManagementService {
  constructor(private ctx: AppContext) {}

  async registerDevice(): Promise<UserDevice> {
    const { name, type, os } = await this.getDeviceInfo();
    const ip_address = this.getIpAddress();
    const db = this.ctx.var.prisma;

    const device = await db.userDevice.create({
      data: {
        name,
        type,
        operating_system: os,
        login_activities: {
          create: {
            ip_address,
          },
        },
      },
    });

    return device;
  }

  async validateDevice(device_id: number): Promise<boolean | null> {
    const db = this.ctx.var.prisma;
    const device = await db.userDevice.findUnique({
      where: {
        id: device_id,
      },
      include: {
        login_activities: true,
      },
    });
    if (!device) return null;

    const score = await this.getMatchScore(device);
    if (score < 0.3) return false;

    return true;
  }

  async addActivity(device_id: number, success: boolean): Promise<void> {
    const db = this.ctx.var.prisma;
    const ip_address = this.getIpAddress();
    await db.loginActivity.create({
      data: {
        device: {
          connect: {
            id: device_id,
          },
        },
        ip_address,
        success,
      },
    });
  }

  private async getMatchScore(
    device: UserDevice & {
      login_activities: LoginActivity[];
    },
  ): Promise<number> {
    const info = await this.getDeviceInfo();
    const ip_address = this.getIpAddress();
    let score = 0;

    if (info.name === device.name) score += 0.2;
    if (info.type === device.type) score += 0.1;
    if (info.os === device.operating_system) score += 0.2;
    if (device.login_activities.some((activity) => activity.ip_address === ip_address))
      score += 0.5;

    return score;
  }

  private async getDeviceInfo(): Promise<{
    name: string;
    type: DeviceType;
    os: DeviceOperatingSystem;
  }> {
    const result = await UAParser(this.ctx.req.header()).withClientHints();
    const name = result.device.model || result.browser.name || result.os.name || "Unknown";

    let type: DeviceType;
    if (result.browser.name) {
      type = DeviceType.Browser;
    } else if (result.device.type === "mobile") {
      type = DeviceType.Mobile;
    } else {
      type = DeviceType.Unknown;
    }

    let os: DeviceOperatingSystem;
    if (result.os.name === "iOS") {
      os = DeviceOperatingSystem.iOS;
    } else if (result.os.name === "Android") {
      os = DeviceOperatingSystem.Android;
    } else {
      os = DeviceOperatingSystem.Unknown;
    }

    return { name, type, os };
  }

  private getIpAddress(): string | undefined {
    return (
      this.ctx.req.header("cf-connecting-ip") ||
      this.ctx.req.header("x-forwarded-for") ||
      this.ctx.env.incoming.socket?.remoteAddress
    );
  }
}
