import { SchoolAccountConfigSchema } from "./schema/generated/zod/index";
import { PrismaClient, SystemServiceStatus } from "@prisma/client";
import console from "console";
import process from "process";
import { z } from "zod";

const prisma = new PrismaClient();

interface SchoolSeed {
  short_name: string;
  full_name: string;
  account_config: z.infer<
    ReturnType<
      typeof SchoolAccountConfigSchema.omit<{
        school_id: true;
      }>
    >
  >;
}

async function main() {
  const schools: SchoolSeed[] = [
    {
      short_name: "文山高中",
      full_name: "高雄市立文山高級中學",
      account_config: {
        username_format: "學號（6 碼）",
        student_username_format: "([0-9]{6})",
        password_format: "1234@wsm",
        domain_name: "mail.wsm.kh.edu.tw",
      },
    },
    {
      short_name: "三民高中",
      full_name: "高雄市立三民高級中學",
      account_config: {
        username_format: "學號（7 碼）",
        student_username_format: "([0-9]{7})",
        password_format: "身分證字號",
        domain_name: "smhs.kh.edu.tw",
      },
    },
    {
      short_name: "左營高中",
      full_name: "高雄市立左營高級中學",
      account_config: {
        username_format: "學號（7 碼）",
        student_username_format: "([0-9]{7})",
        password_format: "身分證字號（開頭英文大寫）",
        domain_name: "tyhs.kh.edu.tw",
      },
    },
    {
      short_name: "前鎮高中",
      full_name: "高雄市立前鎮高級中學",
      account_config: {
        username_format: "stu＋學號（7 碼）",
        student_username_format: "stu([0-9]{7})",
        password_format: "身分證字號（開頭英文大寫）",
        domain_name: "mail2.cjhs.kh.edu.tw",
      },
    },
    {
      short_name: "小港高中",
      full_name: "高雄市立小港高級中學",
      account_config: {
        username_format: "學號（7 碼）",
        student_username_format: "([0-9]{7})",
        password_format: "學號@",
        domain_name: "std.hkhs.kh.edu.tw",
      },
    },
    {
      short_name: "仁武高中",
      full_name: "高雄市立仁武高級中學",
      account_config: {
        username_format: "s（小寫）＋學號（7 碼）",
        student_username_format: "s([0-9]{7})",
        password_format: "請洽本校資訊組",
        domain_name: "rwm.kh.edu.tw",
      },
    },
    {
      short_name: "林園高中",
      full_name: "高雄市立林園高級中學",
      account_config: {
        username_format: "學號（6 碼）",
        student_username_format: "([0-9]{6})",
        password_format: "身分證字號（開頭英文大寫）",
        domain_name: "ms.ly.kh.edu.tw",
      },
    },
    {
      short_name: "高師大附中",
      full_name: "國立高雄師範大學附屬高級中學",
      account_config: {
        username_format: "學號（6 碼）",
        student_username_format: "([0-9]{6})",
        password_format: "身分證字號末9碼（僅數字部分）",
        domain_name: "gs.hs.ntnu.edu.tw",
      },
    },
    {
      short_name: "新興高中",
      full_name: "高雄市立新興高級中學",
      account_config: {
        username_format: "學號（6 碼）",
        student_username_format: "([0-9]{6})",
        password_format: "身分證字號（開頭英文大寫）",
        domain_name: "hhhs.kh.edu.tw",
      },
    },
    {
      short_name: "中正高中",
      full_name: "高雄市立中正高級中學",
      account_config: {
        username_format: "s（小寫）＋學號（7 碼）",
        student_username_format: "s([0-9]{7})",
        password_format: "身分證字號（開頭英文大寫）",
        domain_name: "cchs.kh.edu.tw",
      },
    },
    {
      short_name: "新莊高中",
      full_name: "高雄市立新莊高級中學",
      account_config: {
        username_format: "學號（6 碼）",
        student_username_format: "([0-9]{6})",
        password_format: "學號（6 碼）",
        domain_name: "hchs.kh.edu.tw",
      },
    },
    {
      short_name: "高雄中學",
      full_name: "高雄市立高雄高級中學",
      account_config: {
        username_format: "學號（6 碼）",
        student_username_format: "([0-9]{6})",
        password_format: "身分證字號（開頭英文大寫）",
        domain_name: "student.kshs.kh.edu.tw",
      },
    },
  ];

  for (const school of schools) {
    await prisma.partnerSchool.upsert({
      where: {
        short_name: school.short_name,
        full_name: school.full_name,
      },
      update: {
        google_account_config: {
          upsert: {
            update: school.account_config,
            create: school.account_config,
          },
        },
      },
      create: {
        short_name: school.short_name,
        full_name: school.full_name,
        google_account_config: {
          create: school.account_config,
        },
      },
    });
  }

  const latest_configuration = await prisma.systemConfigurationUpdates.findFirst({
    orderBy: {
      id: "desc",
    },
  });
  if (!latest_configuration) {
    // Create initial system configuration with Asia/Taipei timezone (UTC+8)
    // UKHSC 7th Contract period: 2025/01/01 00:00:00 to 2025/12/31 23:59:59 (Taiwan time)
    await prisma.systemConfigurationUpdates.create({
      data: {
        service_status: SystemServiceStatus.Normal,
        contract_start_date: new Date("2025-01-01T00:00:00+08:00"),
        contract_end_date: new Date("2025-12-31T23:59:59+08:00"),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
