"use strict";

window.addEventListener("load", () => {
  const tables = document.querySelector(".tables");
  const selectsContainer = document.querySelector(".selects-container");
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const breakPoint = 1024;

  const isMobile = () => (window.innerWidth > breakPoint ? false : true);

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

  const createCustomSelect = (option) => {
    const customSelect = document.createElement("div");
    const title = document.createElement("div");
    const itemsContainer = document.createElement("ul");

    customSelect.setAttribute("class", `custom-select select-${option.id}`);
    title.setAttribute("class", "custom-select-title");
    itemsContainer.setAttribute("class", "custom-select-items");

    title.textContent = option.selectedValue;
    option.values.forEach((item, index) => {
      const customSelectItem = document.createElement("li");
      customSelectItem.textContent = item;
      customSelectItem.setAttribute("data-value", option.id === "months" ? index : item);
      itemsContainer.appendChild(customSelectItem);
    });

    customSelect.appendChild(title);
    customSelect.appendChild(itemsContainer);
    selectsContainer.appendChild(customSelect);

    selectEvents(customSelect, itemsContainer);
  };

  const selectEvents = (customSelect, itemsContainer) => {
    Array.from(itemsContainer.children).forEach((item, index) => {
      item.addEventListener("click", () => {
        // console.log(item.getAttribute("data-value"));
      });
    });
  };

  createCustomSelect({
    id: "months",
    values: months,
    selectedValue: months[new Date().getMonth()],
  });

  createCustomSelect({
    id: "years",
    values: [2021, 2022, 2023],
    selectedValue: new Date().getFullYear(),
  });

  const createCalendar = (y) => {
    tables.innerHTML = null;
    for (let i = 1; i <= 12; i++) {
      const table = createTable();
      let lastDayOfMonth = new Date(y, i, 0).getDate();
      let startDay = new Date(y, i - 1, 1).getDay();
      const headerTitle = writeDateToTitle(i - 1, y); // MONTH, YEAR TITLE

      table.appendChild(headerTitle);
      // console.log(months[i - 1], lastDayOfMonth);

      let n = 1, // COUNTER
        control = 1, // START CONTROL
        dayCounterForMobile = startDay;

      for (let k = 0; k <= (isMobile() ? lastDayOfMonth - 1 : Math.ceil((lastDayOfMonth + startDay) / 7)); k++) {
        let row = createRow();
        table.appendChild(row);

        if (k === 0 && !isMobile()) {
          // 0. ROW FOR DAY NAMES
          for (const day of days) {
            const title = createHeadOfTable();
            title.textContent = day;
            row.appendChild(title);
          }
        } else {
          /* CREATE EMPTY COLUMN AND FILL */
          for (let m = 0; m < (isMobile() ? 1 : 7); m++) {
            const col = createColumn();
            if (isMobile()) {
              if (n <= lastDayOfMonth) {
                col.textContent = `${days[dayCounterForMobile]}, ${n < 10 ? "0" + n : n}`;
                n++;
                if (dayCounterForMobile < days.length - 1) {
                  dayCounterForMobile++;
                } else {
                  dayCounterForMobile = 0;
                }
              }
            } else {
              if (control > startDay) {
                if (n <= lastDayOfMonth) {
                  col.textContent = `${n < 10 ? "0" + n : n}`;
                  n++;
                }
              } else {
                control++;
              }
            }

            row.appendChild(col);
          }
        }
      }
    }
  };

  window.addEventListener("resize", () => {
    console.log("Resized!");
    createCalendar(2022);
  });

  createCalendar(2022);
});
