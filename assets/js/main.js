"use strict";

window.addEventListener("load", () => {
  const tables = document.querySelector(".tables");
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

  const createTable = () => {
    const table = document.createElement("table");
    table.setAttribute("class", "table");
    tables.appendChild(table);
    return table;
  };

  const createRow = () => {
    const row = document.createElement("tr");
    row.setAttribute("class", "row");
    return row;
  };

  const createHeadOfTable = () => {
    const title = document.createElement("th");
    title.setAttribute("class", "title");
    return title;
  };

  const createColumn = () => {
    const col = document.createElement("td");
    col.setAttribute("class", "column");
    return col;
  };

  const writeDateToTitle = (m, y) => {
    const headerTitle = document.createElement("h3");
    headerTitle.setAttribute("class", "headerTitle");
    headerTitle.textContent = `${months[m]}, ${y}`;
    return headerTitle;
  };

  const createCalendar = (y) => {
    for (let i = 1; i <= 12; i++) {
      const table = createTable();
      let lastDayOfMonth = new Date(y, i, 0).getDate();
      let startDay = new Date(y, i - 1, 1).getDay();
      const headerTitle = writeDateToTitle(i - 1, y); // MONTH, YEAR TITLE

      table.appendChild(headerTitle);
      console.log(months[i - 1], lastDayOfMonth);

      let n = 1, // COUNTER
        control = 1; // START CONTROL
      for (let k = 0; k <= Math.ceil((lastDayOfMonth + startDay) / 7); k++) {
        let row = createRow();
        table.appendChild(row);

        if (k === 0) {
          // 0. ROW FOR DAY NAMES
          for (const day of days) {
            const title = createHeadOfTable();
            title.textContent = day;
            row.appendChild(title);
          }
        } else {
          /* CREATE EMPTY COLUMN AND FILL */
          for (let m = 0; m < 7; m++) {
            const col = createColumn();
            if (control > startDay) {
              if (n <= lastDayOfMonth) {
                col.textContent = n;
                n++;
              }
            } else {
              control++;
            }
            row.appendChild(col);
          }
        }
      }
    }
  };

  createCalendar(2022);
});