import { DeviceOperatingSystem, DeviceType, LoginActivity, UserDevice } from "@prisma/client";
import { AppContext, getCtx } from "index";
import { UAParser } from "ua-parser-js";
import { isIP } from "net";

interface MatchWeights {
  nameMatch: number;
  typeMatch: number;
  osMatch: number;
  ipMatch: number;
}

export class DeviceManagementService {
  constructor(private ctx: AppContext) {}

  private readonly weights: MatchWeights = {
    nameMatch: 0.3,
    typeMatch: 0.1,
    osMatch: 0.2,
    ipMatch: 0.4,
  };

  async registerDevice(user_id: number): Promise<UserDevice> {
    const { name, type, os } = await this.getDeviceInfo();
    const ip_address = DeviceManagementService.getIpAddress();
    const { db } = this.ctx.var;

    const device = await db.userDevice.create({
      data: {
        user: {
          connect: {
            id: user_id,
          },
        },
        name,
        type,
        operating_system: os,
        login_activities: {
          create: {
            ip_address,
            success: true,
          },
        },
      },
    });

    return device;
  }

  async validateDevice(device_id: number): Promise<boolean | null> {
    const { db } = this.ctx.var;
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

  async addActivity(device_id: number, success: boolean): Promise<LoginActivity> {
    const { db } = this.ctx.var;
    const device = await db.userDevice.findUnique({
      where: {
        id: device_id,
      },
    });
    if (!device) throw new Error("Device not found");

    const ip_address = DeviceManagementService.getIpAddress();
    const activity = await db.loginActivity.create({
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

    return activity;
  }

  private async getMatchScore(
    device: UserDevice & {
      login_activities: LoginActivity[];
    },
  ): Promise<number> {
    const info = await this.getDeviceInfo();
    const ip_address = DeviceManagementService.getIpAddress();
    let score = 0;

    if (info.name === device.name && info.name !== "Unknown") score += this.weights.nameMatch;
    if (info.type === device.type) score += this.weights.typeMatch;
    if (info.os === device.operating_system) score += this.weights.osMatch;
    if (device.login_activities.some((activity) => activity.ip_address === ip_address))
      score += this.weights.ipMatch;

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

  static getIpAddress(): string | undefined {
    const { req, env } = getCtx();

    const ip =
      req.header("cf-connecting-ip") ||
      req.header("x-forwarded-for") ||
      env.incoming.socket?.remoteAddress;

    return ip && isIP(ip) !== 0 ? ip : undefined;
  }

  static getIpCountry(): string | undefined {
    return getCtx().req.header("cf-ipcountry");
  }
}
