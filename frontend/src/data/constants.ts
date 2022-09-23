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
  0: "Январь",
  1: "Февраль",
  2: "Март",
  3: "Апрель",
  4: "Май",
  5: "Июнь",
  6: "Июль",
  7: "Август",
  8: "Сентябрь",
  9: "Октябрь",
  10: "Ноябрь",
  11: "Декабрь",
};
