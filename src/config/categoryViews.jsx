import ClassDetail from '../components/ClassDetail';
import MonsterDetail from '../components/details/MonsterDetail';
import SpellDetail from '../components/details/SpellDetail';
import RaceDetail from '../components/details/RaceDetail';
import BackgroundDetail from '../components/details/BackgroundDetail';
import ItemContentDetail from '../components/details/ItemContentDetail';
import FeatDetail from '../components/details/FeatDetail';
import SubclassDetail from '../components/details/SubclassDetail';
import HomeRuleDetail from '../components/details/HomeRuleDetail';

function ClassDetailView({ item }) {
  return <ClassDetail classData={item} />;
}

export const categoryViews = {
  monsters: { Detail: MonsterDetail },
  spells: { Detail: SpellDetail },
  classes: { Detail: ClassDetailView },
  races: { Detail: RaceDetail },
  items: { Detail: ItemContentDetail },
  feats: { Detail: FeatDetail },
  subclasses: { Detail: SubclassDetail },
  backgrounds: { Detail: BackgroundDetail },
  homerules: { Detail: HomeRuleDetail },
};
