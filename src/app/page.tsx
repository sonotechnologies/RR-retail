import { CakesEvents } from '@/components/sections/CakesEvents';
import { Concepts } from '@/components/sections/Concepts';
import { Hero } from '@/components/sections/Hero';
import { Signatures } from '@/components/sections/Signatures';
import { Social } from '@/components/sections/Social';
import { Space } from '@/components/sections/Space';
import { VisitBlock } from '@/components/sections/VisitBlock';
import { getMenu } from '@/lib/menu';
import { getSkin } from '@/lib/skin';

export const revalidate = 300;

export default async function Home() {
  const skin = getSkin();
  const menu = await getMenu();
  const signatures = menu.filter((m) => m.featured).slice(0, 6);
  return (
    <>
      <Hero skin={skin} />
      <Concepts skin={skin} />
      <Signatures skin={skin} items={signatures} />
      <Space skin={skin} />
      <Social skin={skin} />
      <CakesEvents skin={skin} />
      <VisitBlock skin={skin} />
    </>
  );
}
