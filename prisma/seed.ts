import { SchoolAccountConfigSchema } from "./schema/generated/zod/index";
import { PartnerPlan, PrismaClient } from "@prisma/client";
import console from "console";
import process from "process";
import { z } from "zod";

const prisma = new PrismaClient();

interface SchoolSeed {
  short_name: string;
  full_name: string;
  plan?: PartnerPlan;
  account_config?: z.infer<
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
      plan: PartnerPlan.Combined,
    },
    {
      short_name: "三民高中",
      full_name: "高雄市立三民高級中學",
      plan: PartnerPlan.Personal,
    },
    {
      short_name: "左營高中",
      full_name: "高雄市立左營高級中學",
      plan: PartnerPlan.Personal,
    },
    {
      short_name: "前鎮高中",
      full_name: "高雄市立前鎮高級中學",
      plan: PartnerPlan.Personal,
    },
    {
      short_name: "小港高中",
      full_name: "高雄市立小港高級中學",
      plan: PartnerPlan.Combined,
    },
    {
      short_name: "仁武高中",
      full_name: "高雄市立仁武高級中學",
      account_config: {
        username_format: "s＋學號",
        student_username_format: "s[0-9]{7}",
        password_format: "請洽本校資訊組",
        domain_name: "rwm.kh.edu.tw",
      },
    },
    {
      short_name: "林園高中",
      full_name: "高雄市立林園高級中學",
      plan: PartnerPlan.Combined,
    },
    {
      short_name: "高師大附中",
      full_name: "國立高雄師範大學附屬高級中學",
      plan: PartnerPlan.Personal,
    },
    {
      short_name: "新興高中",
      full_name: "高雄市立新興高級中學",
    },
    {
      short_name: "中正高中",
      full_name: "高雄市立中正高級中學",
    },
    {
      short_name: "高雄中學",
      full_name: "高雄市立高雄高級中學",
    },
  ];

  for (const school of schools) {
    const result = await prisma.partnerSchool.upsert({
      where: {
        short_name: school.short_name,
        full_name: school.full_name,
      },
      update: {
        plan: school.plan,
      },
      create: {
        ...school,
      },
    });

    if (school.account_config) {
      await prisma.schoolAccountConfig.upsert({
        where: {
          school_id: result.id,
        },
        update: {
          ...school.account_config,
        },
        create: {
          school: {
            connect: {
              id: result.id,
            },
          },
          ...school.account_config,
        },
      });
    }
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
