interface IColors {
  [key: string]: string;
}

interface IMonth {
  [key: number]: string;
}

const COLORS = {
  gray: "gray",
  red: "red",
  orange: "orange",
  yellow: "yellow",
  green: "green",
  teal: "teal",
  blue: "blue",
  indigo: "indigo",
  purple: "purple",
  pink: "pink",
};

export const colors: IColors = {
  paid: COLORS.orange,
  visited: COLORS.green,
  unPaid: COLORS.gray,
  missed: COLORS.red,
  postponed: COLORS.blue,
};

export const STATUSES = {
  paid: "Оплачен",
  visited: "Присутствовал",
  unPaid: "Неоплачен",
  missed: "Пропущен",
  postponed: "Перенесено",
};

export const monthList: IMonth = {
  1: "Январь",
  2: "Февраль",
  3: "Март",
  4: "Апрель",
  5: "Май",
  6: "Июнь",
  7: "Июль",
  8: "Август",
  9: "Сентябрь",
  10: "Октябрь",
  11: "Ноябрь",
  12: "Декабрь",
};
