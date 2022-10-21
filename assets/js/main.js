"use strict";

window.addEventListener("load", () => {
  const tablesContainer = document.querySelector(".tables");
  const selectsContainer = document.querySelector(".selects-container");
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const breakPoint = 1024;
  const selectedDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  };

  const isMobile = () => (window.innerWidth > breakPoint ? false : true);

  const createTable = () => {
    const table = document.createElement("table");
    table.setAttribute("class", "table");
    tablesContainer.appendChild(table);
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

    customSelect.setAttribute("class", "custom-select");
    customSelect.setAttribute("data-is-open", false);
    customSelect.setAttribute("data-type", option.id);
    title.setAttribute("class", "custom-select-title");
    title.textContent = option.selectedValue;
    itemsContainer.setAttribute("class", "custom-select-items");

    option.values.forEach((value) => {
      const customSelectItem = document.createElement("li");
      customSelectItem.textContent = value;
      customSelectItem.setAttribute("data-value", typeof value === "string" ? value.toLowerCase() : value);
      itemsContainer.appendChild(customSelectItem);
    });

    customSelect.appendChild(title);
    customSelect.appendChild(itemsContainer);
    selectsContainer.appendChild(customSelect);

    selectEvents(customSelect, itemsContainer);
  };

  const selectEvents = (customSelect, itemsContainer) => {
    const selectType = customSelect.getAttribute("data-type");

    customSelect.addEventListener("click", () => {
      if (customSelect.getAttribute("data-is-open") === "true") {
        customSelect.setAttribute("data-is-open", false);
      } else {
        customSelect.setAttribute("data-is-open", true);
      }
    });

    for (const item of itemsContainer.children) {
      item.addEventListener("click", () => {
        let value = item.getAttribute("data-value");
        switch (selectType) {
          case "month":
            selectedDate.month = months.map((month) => month.toLowerCase()).indexOf(value);
            updateSelect();
            createCalendar(selectedDate);
            break;
          case "year":
            selectedDate.year = parseInt(value);
            selectedDate.month = 0;
            updateSelect();
            createCalendar(selectedDate);
          default:
            break;
        }
      });
    }
  };

  const updateSelect = () => {
    // UPDATE TO SELECT'S TITLE
    const selects = document.querySelectorAll(".custom-select");
    for (const select of selects) {
      let selectType = select.getAttribute("data-type");
      select.children[0].textContent = selectType === "month" ? months[selectedDate[selectType]] : selectedDate[selectType];
    }
  };

  createCustomSelect({
    id: "month",
    values: months,
    selectedValue: months[new Date().getMonth()],
  });

  createCustomSelect({
    id: "year",
    values: [2021, 2022, 2023],
    selectedValue: new Date().getFullYear(),
  });

  const createCalendar = (date) => {
    tablesContainer.innerHTML = null;
    const table = createTable();
    let lastDayOfMonth = new Date(date.year, date.month + 1, 0).getDate();
    let startDay = new Date(date.year, date.month, 1).getDay();
    const headerTitle = writeDateToTitle(date.month, date.year); // MONTH, YEAR TITLE
    table.insertAdjacentElement("beforebegin", headerTitle);

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
  };

  window.addEventListener("resize", () => {
    createCalendar(selectedDate);
  });

  createCalendar(selectedDate);
});
