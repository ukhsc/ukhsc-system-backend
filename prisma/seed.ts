import { PartnerPlan, PrismaClient } from "@prisma/client";
import console from "console";
import process from "process";

const prisma = new PrismaClient();

async function main() {
  const schools = [
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
      plan: PartnerPlan.GroupA,
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
      plan: PartnerPlan.Combined,
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
  ];

  for (const school of schools) {
    await prisma.partnerSchool.upsert({
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
