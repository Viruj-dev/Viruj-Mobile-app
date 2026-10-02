import type { Icon } from "./ui";

const icons: [RegExp, Icon][] = [
  [/cardiac.*anaesth/i, "pulse-outline"],
  [/cardiac.*surg/i, "cut-outline"],
  [/cardiac sciences/i, "heart-circle-outline"],
  [/cardiol|cardiac/i, "heart-outline"],
  [/psychiatr/i, "chatbubbles-outline"],
  [/dermatol/i, "hand-left-outline"],
  [/critical|anaesth|\bicu\b/i, "medkit-outline"],
  [/dental|dentistry|oral/i, "happy-outline"],
  [/imaging|radiolog/i, "scan-outline"],
  [/diagnos|laborator/i, "flask-outline"],
  [/\bent\b|ear|nose|throat/i, "ear-outline"],
  [/gastro/i, "nutrition-outline"],
  [/geriatr/i, "accessibility-outline"],
  [/fertility|\bivf\b|obstetric|gynae|women/i, "female-outline"],
  [/nephrol|urolog/i, "water-outline"],
  [/neuro/i, "bulb-outline"],
  [/nuclear/i, "nuclear-outline"],
  [/ophthalm/i, "eye-outline"],
  [/orthop|spine/i, "walk-outline"],
  [/paediatr|child/i, "people-outline"],
  [/respirat|pulmon/i, "cloud-outline"],
  [/sports/i, "fitness-outline"],
  [/plastic|cosmetic/i, "sparkles-outline"],
  [/oncolog/i, "ribbon-outline"],
  [/emergency/i, "alert-circle-outline"],
  [/surg/i, "bandage-outline"],
];

export function departmentIcon(name: string): Icon {
  return icons.find(([pattern]) => pattern.test(name))?.[1] ?? "medical-outline";
}
