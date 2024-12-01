import { PartnerPlan, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.partnerSchool.createMany({
    data: [
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
        short_name: "仁武高中",
        full_name: "高雄市立仁武高級中學",
        plan: PartnerPlan.Combined,
      },
      {
        short_name: "林園高中",
        full_name: "高雄市立林園高級中學",
        plan: PartnerPlan.Combined,
      },
    ],
  });
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
