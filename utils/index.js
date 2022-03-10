module.exports = {
  handlingError: (res, e) => {
    res.status(401).json({ message: e, status: 401 });
    console.log(e);
  },

  pagination: (page, limitData) => {
    let currentPage = parseInt(page) || 1;
    let limit = parseInt(limitData) || 5;
    let offset = (parseInt(currentPage) - 1) * limit || 0;

    return { limit, offset };
  },

  generateId: () => {
    // 8 digit
    return 1e3 + Math.floor(Math.random() * 9e3);
  },

  stringToDate: (dateString) => {
    const [day, month, year] = dateString.split("-");
    return new Date([month, parseInt(day) + 1, year].join("/"));
  },

  calculateMonth: (d1, d2) => {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  },
};
