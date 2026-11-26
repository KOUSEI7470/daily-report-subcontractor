document.title = "TEST-20260422";

// ==============================
// EmailJS 設定（config.js 参照）
// ==============================
const EMAILJS_PUBLIC_KEY = window.EMAILJS_CONFIG?.publicKey || "";
const EMAILJS_SERVICE_ID = window.EMAILJS_CONFIG?.serviceId || "";
const EMAILJS_TEMPLATE_ID = window.EMAILJS_CONFIG?.templateId || "";

// ==============================
// 要素取得
// ==============================
const els = {
  workDate: document.getElementById("workDate"),
  datePreview: document.getElementById("datePreview"),
  destinationCompany: document.getElementById("destinationCompany"),
  siteName: document.getElementById("siteName"),
  meetingPlace: document.getElementById("meetingPlace"),
  primeCompany: document.getElementById("primeCompany"),
  affiliationCompany: document.getElementById("affiliationCompany"),
  startTime: document.getElementById("startTime"),
  endTime: document.getElementById("endTime"),
  workContent: document.getElementById("workContent"),
  otherNote: document.getElementById("otherNote"),
  divingWorkers: document.getElementById("divingWorkers"),
  landWorkers: document.getElementById("landWorkers"),
  standbyWorkers: document.getElementById("standbyWorkers"),
  moveWorkers: document.getElementById("moveWorkers"),
  clearButton: document.getElementById("clearButton"),
  summaryButton: document.getElementById("summaryButton"),
  excelButton: document.getElementById("excelButton"),
  summaryArea: document.getElementById("summaryArea")
};

// ==============================
// 日付関連
// ==============================
function setTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  els.workDate.value = `${yyyy}-${mm}-${dd}`;
  updateDatePreview();
}

function formatDateSlash(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}/${m}/${d}`;
}

function getWeekdayShort(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return weekdays[date.getDay()];
}

function formatDateWithWeekday(dateString) {
  const dateSlash = formatDateSlash(dateString);
  const weekday = getWeekdayShort(dateString);
  if (!dateSlash || !weekday) return "日付を選択してください";
  return `${dateSlash}（${weekday}）`;
}

function updateDatePreview() {
  els.datePreview.textContent = formatDateWithWeekday(els.workDate.value);
}

// ==============================
// 入力値取得
// ==============================
function getInputValue(el) {
  return el.value.trim();
}

function getFormData() {
  return {
    workDate: getInputValue(els.workDate),
    workDateSlash: formatDateSlash(getInputValue(els.workDate)),
    weekday: getWeekdayShort(getInputValue(els.workDate)),
    workDateText: formatDateWithWeekday(getInputValue(els.workDate)),
    destinationCompany: getInputValue(els.destinationCompany),
    siteName: getInputValue(els.siteName),
    meetingPlace: getInputValue(els.meetingPlace),
    primeCompany: getInputValue(els.primeCompany),
    affiliationCompany: getInputValue(els.affiliationCompany),
    startTime: getInputValue(els.startTime),
    endTime: getInputValue(els.endTime),
    workContent: getInputValue(els.workContent),
    otherNote: getInputValue(els.otherNote),
    divingWorkers: getInputValue(els.divingWorkers),
    landWorkers: getInputValue(els.landWorkers),
    standbyWorkers: getInputValue(els.standbyWorkers),
    moveWorkers: getInputValue(els.moveWorkers)
  };
}

// ==============================
// 整理表示（入力文字列のXSS対策）
// ==============================
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[char];
  });
}

// 入力欄内の改行を維持しつつ、HTMLとして解釈させない
function safeDisplay(value) {
  return escapeHTML(value || "未入力").replace(/\r\n|\r|\n/g, "<br>");
}

function buildSummaryHTML(data) {
  return `
    <div><strong>【基本情報】</strong></div>
    <div>日付：${safeDisplay(data.workDateText)}</div>
    <div>行先会社名：${safeDisplay(data.destinationCompany)}</div>
    <div>現場名：${safeDisplay(data.siteName)}</div>
    <div>集合場所：${safeDisplay(data.meetingPlace)}</div>
    <div>元請会社名：${safeDisplay(data.primeCompany)}</div>
    <div>所属会社名：${safeDisplay(data.affiliationCompany)}</div>
    <div>始業時間：${safeDisplay(data.startTime)}</div>
    <div>終業時間：${safeDisplay(data.endTime)}</div>
    <div>作業内容：${safeDisplay(data.workContent)}</div>
    <br>
    <div><strong>【作業員】</strong></div>
    <div>潜水作業員：${safeDisplay(data.divingWorkers)}</div>
    <div>陸上作業員：${safeDisplay(data.landWorkers)}</div>
    <div>待機：${safeDisplay(data.standbyWorkers)}</div>
    <div>移動：${safeDisplay(data.moveWorkers)}</div>
    <br>
    <div><strong>【その他】</strong></div>
    <div>${safeDisplay(data.otherNote)}</div>
  `;
}

function showSummary() {
  const data = getFormData();
  els.summaryArea.innerHTML = buildSummaryHTML(data);
}

// ==============================
// メール送信用テキスト
// ==============================
function buildMailBody(data) {
  return [
    "【作業日報テスト999】",
    "",
    `日付：${data.workDateText || "未入力"}`,
    `行先会社名：${data.destinationCompany || "未入力"}`,
    `現場名：${data.siteName || "未入力"}`,
    `集合場所：${data.meetingPlace || "未入力"}`,
    `元請会社名：${data.primeCompany || "未入力"}`,
    `所属会社名：${data.affiliationCompany || "未入力"}`,
    `始業時間：${data.startTime || "未入力"}`,
    `終業時間：${data.endTime || "未入力"}`,
    `作業内容：${data.workContent || "未入力"}`,
    "",
    "【作業員】",
    `潜水作業員：${data.divingWorkers || "未入力"}`,
    `陸上作業員：${data.landWorkers || "未入力"}`,
    `待機：${data.standbyWorkers || "未入力"}`,
    `移動：${data.moveWorkers || "未入力"}`,
    "",
    "【その他】",
    data.otherNote || "未入力"
  ].join("\n");
}

// ==============================
// 送信
// ==============================
async function sendReport() {
  const data = getFormData();

  if (!data.workDate) {
    alert("日付を入力してください。");
    return;
  }

  if (!data.destinationCompany) {
    alert("行先会社名を入力してください。");
    return;
  }

  if (!data.siteName) {
    alert("現場名を入力してください。");
    return;
  }

  if (!data.startTime) {
    alert("始業時間を入力してください。");
    return;
  }

  if (!data.endTime) {
    alert("終業時間を入力してください。");
    return;
  }

  if (typeof emailjs === "undefined") {
    alert("EmailJSが読み込まれていません。");
    return;
  }

  const originalText = els.excelButton.textContent;
  const mailBody = buildMailBody(data);

  try {
    els.excelButton.disabled = true;
    els.excelButton.textContent = "送信中...";

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        message: mailBody
      }
    );

    // 送信内容を確認欄に表示
    els.summaryArea.innerHTML = buildSummaryHTML(data);

    // 画面中央に大きく「送信完了」を表示
    if (typeof window.showSendComplete === "function") {
      window.showSendComplete(2500);
    } else {
      alert("送信完了");
    }

    // 送信完了表示が消えた後、入力内容をクリア
    setTimeout(() => {
      clearAll();
    }, 2800);

  } catch (error) {
    console.error("送信エラー:", error);
    alert("送信に失敗しました。");

  } finally {
    els.excelButton.disabled = false;
    els.excelButton.textContent = originalText;
  }
}

// ==============================
// 全クリア
// ==============================
function clearAll() {
  els.destinationCompany.value = "";
  els.siteName.value = "";
  els.meetingPlace.value = "";
  els.primeCompany.value = "";
  els.affiliationCompany.value = "";
  els.startTime.value = "";
  els.endTime.value = "";
  els.workContent.value = "";
  els.otherNote.value = "";
  els.divingWorkers.value = "";
  els.landWorkers.value = "";
  els.standbyWorkers.value = "";
  els.moveWorkers.value = "";

  setTodayDate();
  els.summaryArea.textContent = "ここに表示";
}

function roundTimeStringToStep(timeString, stepSeconds = 300) {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return timeString;

  const totalSeconds = hours * 3600 + minutes * 60;
  const steppedSeconds = Math.round(totalSeconds / stepSeconds) * stepSeconds;
  const steppedHours = Math.floor((steppedSeconds % 86400) / 3600);
  const steppedMinutes = Math.floor((steppedSeconds % 3600) / 60);

  return `${String(steppedHours).padStart(2, "0")}:${String(steppedMinutes).padStart(2, "0")}`;
}

// ==============================
// イベント登録
// ==============================
function bindEvents() {
  els.workDate.addEventListener("change", updateDatePreview);
  els.summaryButton.addEventListener("click", showSummary);
  els.clearButton.addEventListener("click", clearAll);
  els.excelButton.addEventListener("click", sendReport);

  if (els.startTime) {
    els.startTime.setAttribute("step", "300");
    const snapStartTime = () => {
      els.startTime.value = roundTimeStringToStep(els.startTime.value, 300);
    };
    els.startTime.addEventListener("input", snapStartTime);
    els.startTime.addEventListener("change", snapStartTime);
    els.startTime.addEventListener("blur", snapStartTime);
  }

  if (els.endTime) {
    els.endTime.setAttribute("step", "300");
    const snapEndTime = () => {
      els.endTime.value = roundTimeStringToStep(els.endTime.value, 300);
    };
    els.endTime.addEventListener("input", snapEndTime);
    els.endTime.addEventListener("change", snapEndTime);
    els.endTime.addEventListener("blur", snapEndTime);
  }
}

// ==============================
// 初期化
// ==============================
function init() {
  if (typeof emailjs !== "undefined" && EMAILJS_PUBLIC_KEY) {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY
    });
  }

  setTodayDate();
  bindEvents();
}

init();