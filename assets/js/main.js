"use strict";

window.addEventListener("load", () => {
  const tablesContainer = document.querySelector(".tables");
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const breakPoint = 1024;
  const selectedDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  };

  const isMobile = () => (window.innerWidth > breakPoint ? false : true);

  const createElem = (type, attributes = {}) => {
    const elem = document.createElement(type);
    for (let i = 0; i < Object.entries(attributes).length; i++) {
      elem.setAttribute(Object.keys(attributes)[i], Object.values(attributes)[i]);
    }

    return elem;
  };

  const createTable = () => {
    const table = createElem("table", {
      class: "table",
    });

    return table;
  };

  const createRow = () => {
    const row = createElem("tr", {
      class: "row",
    });

    return row;
  };

  const createHeadOfTable = () => {
    const title = createElem("th", {
      class: "title",
    });

    return title;
  };

  const createColumn = () => {
    const col = createElem("td", {
      class: "column",
    });

    return col;
  };

  const writeDateToTitle = (m, y) => {
    const headerTitle = createElem("h3", {
      class: "headerTitle",
    });
    headerTitle.textContent = `${months[m]}, ${y}`;
    return headerTitle;
  };

  const createCustomSelect = (option) => {
    let { id, selectedValue, values, container } = option;
    const control = document.querySelectorAll(`[data-type=${id}]`);
    const customSelect = createElem("div", {
      class: "custom-select",
      "data-is-open": false,
      "data-type": id,
    });

    const title = createElem("div", {
      class: "custom-select-title",
    });

    const itemsContainer = createElem("ul", {
      class: "custom-select-items",
    });

    if (control.length === 0) {
      title.textContent = selectedValue;

      values.forEach((value) => {
        const customSelectItem = createElem("li", {
          "data-value": typeof value === "string" ? value.toLowerCase() : value,
        });
        customSelectItem.textContent = value;
        itemsContainer.appendChild(customSelectItem);
      });

      customSelect.appendChild(title);
      customSelect.appendChild(itemsContainer);
      container.appendChild(customSelect);

      selectEvents(customSelect, itemsContainer);
    }
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
    container: document.querySelector(".selects-container"),
  });

  createCustomSelect({
    id: "year",
    values: [2021, 2022, 2023],
    selectedValue: new Date().getFullYear(),
    container: document.querySelector(".selects-container"),
  });

  const createCalendar = (date) => {
    tablesContainer.innerHTML = null;
    const table = createTable();
    tablesContainer.appendChild(table);
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
          const dayNumber = document.createElement("div");
          dayNumber.setAttribute("class", "day-number");
          if (isMobile()) {
            if (n <= lastDayOfMonth) {
              dayNumber.textContent = `${days[dayCounterForMobile]}, ${n < 10 ? "0" + n : n}`;
              dayNumber.setAttribute("data-day", n);
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
                dayNumber.textContent = `${n < 10 ? "0" + n : n}`;
                dayNumber.setAttribute("data-day", n);
                n++;
              }
            } else {
              control++;
            }
          }

          if (date.month === new Date().getMonth() && parseInt(dayNumber.getAttribute("data-day")) === new Date().getDate() && date.year === new Date().getFullYear()) {
            dayNumber.classList.add("active-day");
          }
          col.appendChild(dayNumber);
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
