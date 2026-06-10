/**
 * Ultimate Reserve Pro - GAS Integration Script (防弾・高耐久版)
 * 
 * 【スプレッドシートの準備】
 * スプレッドシートの 拡張機能 -> Apps Script を開き、
 * このスクリプトの内容で上書き（すべて貼り付け）して保存してください。
 * その後、「デプロイ」->「新しいデプロイ」から「ウェブアプリ」として、
 * 「アクセスできるユーザー」を「全員」に設定して新規デプロイを実行してください。
 * 発行されたウェブアプリのURLをダッシュボードや各フォームに設定してください。
 */

const SECRET_KEY = ""; // セキュリティ設定（必要に応じて設定）

// ── 初期化とシートの自動生成 ──
function getOrCreateSheet(sheetName, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f4f6");
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function initSheets() {
  getOrCreateSheet("予約リスト", [
    "ID", "申請日時", "予約種別", "LINEアカウント", "ご紹介者", "氏名", "ふりがな", "電話番号", 
    "区分", "第1希望", "第2希望", "第3希望", "支払い方法", "ステータス", "確定日付", "確定時間", "確定データ"
  ]);
  getOrCreateSheet("不定休カレンダー", ["日付", "メモ"]);
  getOrCreateSheet("顧客管理", ["氏名", "電話番号", "アクション回数", "ブロック状態", "最終更新"]);
}

// ── GETリクエスト処理 (データ取得 & ブロックチェック) ──
function doGet(e) {
  try {
    initSheets();
    const action = e.parameter.action;
    const mode = e.parameter.mode;
    const callback = e.parameter.callback;

    // 1. 予約申請前の顧客ブロックチェック (予約変更・新規予約両フォームから呼び出される)
    if (mode === "check_user") {
      const name = normalizeString(e.parameter.name);
      const tel = normalizePhone(e.parameter.tel);
      
      const blockCheck = checkUserBlockStatus(name, tel);
      
      const result = { exists: blockCheck.isBlocked, reason: blockCheck.reason };
      return outputJSONP(result, callback);
    }

    // 2. フォーム初期化時の空き枠・不定休の取得 (JSONP)
    if (e.parameter.callback && !action) {
      const holidays = getHolidaysList();
      const bookedSlots = getBookedSlots();
      const result = { holidays: holidays, slots: bookedSlots };
      return outputJSONP(result, callback);
    }

    // 3. ダッシュボードからのデータ一括取得 (JSON)
    if (action === "getAll") {
      const appts = getApptsList();
      const holidays = getHolidaysMap();
      const customers = getCustomersList();
      
      return outputJSON({ appts, holidays, customers });
    }

    return outputJSON({ error: "Invalid action" });
  } catch (err) {
    return outputJSON({ error: err.toString(), stack: err.stack });
  }
}

// ── POSTリクエスト処理 (データ書き込み & 更新) ──
function doPost(e) {
  try {
    initSheets();
    let postData;
    try {
      postData = JSON.parse(e.postData.contents);
    } catch (err) {
      // 従来のフォーム送信(POST)などのフォールバック
      postData = e.parameter;
    }

    const action = postData.action;

    // 1. 予約フォームからの送信（新規予約・予約変更の申請）
    const isReservation = (action === "submit_reservation") || (postData.type && (
      String(postData.type).includes("予約") || 
      String(postData.type).includes("希望") || 
      String(postData.type).includes("変更") || 
      String(postData.type).includes("紹介") || 
      String(postData.type).includes("カウンセリング")
    ));
    if (isReservation) {
      return handleFormSubmission(postData);
    }

    // 2. ダッシュボード：予約ステータスの更新（確定 / 電話案内など）
    if (action === "updateStatus") {
      return handleUpdateStatus(postData);
    }

    // 3. ダッシュボード：不定休の追加
    if (action === "addHoliday") {
      const sheet = getOrCreateSheet("不定休カレンダー");
      const date = String(postData.date);
      const memo = postData.memo || "";
      
      // 重複チェック
      const data = sheet.getDataRange().getValues();
      let rowIdx = -1;
      for (let i = 1; i < data.length; i++) {
        if (formatDateString(data[i][0]) === date) {
          rowIdx = i + 1;
          break;
        }
      }
      
      if (rowIdx > 0) {
        sheet.getRange(rowIdx, 2).setValue(memo);
      } else {
        sheet.appendRow([date, memo]);
      }
      return outputJSON({ success: true });
    }

    // 4. ダッシュボード：不定休の削除
    if (action === "deleteHoliday") {
      const sheet = getOrCreateSheet("不定休カレンダー");
      const date = String(postData.date);
      const data = sheet.getDataRange().getValues();
      
      for (let i = data.length - 1; i >= 1; i--) {
        if (formatDateString(data[i][0]) === date) {
          sheet.deleteRow(i + 1);
        }
      }
      return outputJSON({ success: true });
    }

    // 5. ダッシュボード：顧客管理データの更新（手動変更・ブロック切替）
    if (action === "updateCustomer") {
      const name = normalizeString(postData.name);
      const tel = normalizePhone(postData.tel);
      const changeCount = parseInt(postData.changeCount || 0, 10);
      const isBlocked = postData.isBlocked === true || postData.isBlocked === "true" || postData.isBlocked === "TRUE";
      
      updateCustomerData(name, tel, changeCount, isBlocked);
      return outputJSON({ success: true });
    }

    // 6. ダッシュボード：顧客管理データの削除
    if (action === "deleteCustomer") {
      const name = normalizeString(postData.name);
      const tel = normalizePhone(postData.tel);
      
      deleteCustomerData(name, tel);
      return outputJSON({ success: true });
    }

    return outputJSON({ error: "Invalid POST action" });
  } catch (err) {
    return outputJSON({ error: err.toString(), stack: err.stack });
  }
}

// ── 予約フォームからの申請処理 ──
function handleFormSubmission(data) {
  const sheet = getOrCreateSheet("予約リスト");
  const id = "R" + Date.now();
  const nowStr = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm");
  
  const type = data.type || "予約申請";
  const clinicId = data.clinic_id || "";
  const referral = data.referral || "";
  const name = normalizeString(data.name || "");
  const kana = data.kana || "";
  const tel = normalizePhone(data.tel || "");
  const classification = data.classification || "";
  const choice1 = data.choice1 || "";
  const choice2 = data.choice2 || "";
  const choice3 = data.choice3 || "";
  const payment = data.payment || "";
  const status = "pending"; // 未処理で登録
  
  sheet.appendRow([
    id, nowStr, type, clinicId, referral, name, kana, tel,
    classification, choice1, choice2, choice3, payment, status, "", "", ""
  ]);

  // 新規予約・再予約フォームから申請された際、顧客管理シートに未登録なら初期値で登録する
  const custSheet = getOrCreateSheet("顧客管理");
  const custData = custSheet.getDataRange().getValues();
  let exists = false;
  
  for (let i = 1; i < custData.length; i++) {
    if (normalizeString(custData[i][0]) === name && normalizePhone(custData[i][1]) === tel) {
      exists = true;
      break;
    }
  }
  
  if (!exists) {
    // 新規登録
    const initialCount = 1; // 最初のアクションなので1
    custSheet.appendRow([
      name, 
      tel, 
      initialCount, 
      "FALSE", 
      Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm")
    ]);
  }

  return outputJSON({ success: true, id: id });
}

// ── 予約確定（ステータス更新）時の処理 ──
function handleUpdateStatus(postData) {
  const sheet = getOrCreateSheet("予約リスト");
  const data = sheet.getDataRange().getValues();
  const id = String(postData.id);
  const status = postData.status;
  const confirmedData = postData.confirmedData || null;

  let rowIdx = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === id) {
      rowIdx = i + 1;
      break;
    }
  }

  if (rowIdx > 0) {
    const oldStatus = String(data[rowIdx - 1][13] || ""); // 元のステータスを取得
    sheet.getRange(rowIdx, 14).setValue(status); // ステータス
    if (confirmedData) {
      sheet.getRange(rowIdx, 15).setValue(confirmedData.date || ""); // 確定日付
      sheet.getRange(rowIdx, 16).setValue(confirmedData.time || ""); // 確定時間
      sheet.getRange(rowIdx, 17).setValue(confirmedData.script || ""); // スクリプト
    }
    
    // 【重要】予約確定時の自動履歴カウント＆ブロックロジック
    if (status === "done" && oldStatus !== "done") {
      const type = String(data[rowIdx - 1][2] || ""); // 予約種別
      const name = normalizeString(data[rowIdx - 1][5] || "");
      const tel = normalizePhone(data[rowIdx - 1][7] || "");
      
      const custSheet = getOrCreateSheet("顧客管理");
      const custData = custSheet.getDataRange().getValues();
      let custRowIdx = -1;
      let currentCount = 0;
      let isBlocked = false;
      
      for (let j = 1; j < custData.length; j++) {
        if (normalizeString(custData[j][0]) === name && normalizePhone(custData[j][1]) === tel) {
          custRowIdx = j + 1;
          currentCount = parseInt(custData[j][2] || 0, 10);
          isBlocked = custData[j][3] === true || custData[j][3] === "true" || custData[j][3] === "TRUE";
          break;
        }
      }
      
      // もし予約変更が確定された場合、アクション回数をカウントアップ
      if (type.includes("変更")) {
        currentCount = currentCount + 1;
        if (currentCount >= 2) {
          isBlocked = true; // 次回ブロック
        }
        
        const nowStr = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm");
        if (custRowIdx > 0) {
          custSheet.getRange(custRowIdx, 3).setValue(currentCount);
          custSheet.getRange(custRowIdx, 4).setValue(isBlocked ? "TRUE" : "FALSE");
          custSheet.getRange(custRowIdx, 5).setValue(nowStr);
        } else {
          custSheet.appendRow([name, tel, currentCount, isBlocked ? "TRUE" : "FALSE", nowStr]);
        }
      }
    }
    
    // 【差し戻しロジック】もし確定（done）から未処理（pending/phone）に戻す場合、カウントを差し引く
    if (oldStatus === "done" && status !== "done") {
      const type = String(data[rowIdx - 1][2] || ""); // 予約種別
      const name = normalizeString(data[rowIdx - 1][5] || "");
      const tel = normalizePhone(data[rowIdx - 1][7] || "");
      
      if (type.includes("変更")) {
        const custSheet = getOrCreateSheet("顧客管理");
        const custData = custSheet.getDataRange().getValues();
        let custRowIdx = -1;
        let currentCount = 0;
        let isBlocked = false;
        
        for (let j = 1; j < custData.length; j++) {
          if (normalizeString(custData[j][0]) === name && normalizePhone(custData[j][1]) === tel) {
            custRowIdx = j + 1;
            currentCount = parseInt(custData[j][2] || 0, 10);
            isBlocked = custData[j][3] === true || custData[j][3] === "true" || custData[j][3] === "TRUE";
            break;
          }
        }
        
        if (custRowIdx > 0) {
          currentCount = Math.max(0, currentCount - 1);
          if (currentCount < 2) {
            isBlocked = false; // 2回未満になったのでブロック解除
          }
          const nowStr = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm");
          custSheet.getRange(custRowIdx, 3).setValue(currentCount);
          custSheet.getRange(custRowIdx, 4).setValue(isBlocked ? "TRUE" : "FALSE");
          custSheet.getRange(custRowIdx, 5).setValue(nowStr);
        }
      }
    }

    return outputJSON({ success: true });
  }

  return outputJSON({ error: "Appointment not found" });
}

// ── 顧客管理データの操作ロジック ──
function updateCustomerData(name, tel, changeCount, isBlocked) {
  const sheet = getOrCreateSheet("顧客管理");
  const data = sheet.getDataRange().getValues();
  let rowIdx = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (normalizeString(data[i][0]) === name && normalizePhone(data[i][1]) === tel) {
      rowIdx = i + 1;
      break;
    }
  }
  
  const nowStr = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm");
  if (rowIdx > 0) {
    sheet.getRange(rowIdx, 3).setValue(changeCount);
    sheet.getRange(rowIdx, 4).setValue(isBlocked ? "TRUE" : "FALSE");
    sheet.getRange(rowIdx, 5).setValue(nowStr);
  } else {
    sheet.appendRow([name, tel, changeCount, isBlocked ? "TRUE" : "FALSE", nowStr]);
  }
}

function deleteCustomerData(name, tel) {
  const sheet = getOrCreateSheet("顧客管理");
  const data = sheet.getDataRange().getValues();
  
  for (let i = data.length - 1; i >= 1; i--) {
    if (normalizeString(data[i][0]) === name && normalizePhone(data[i][1]) === tel) {
      sheet.deleteRow(i + 1);
    }
  }
}

// ── ブロック状態・すり抜けチェック関数 ──
function checkUserBlockStatus(name, tel) {
  // 1. 顧客管理シートからブロック情報を検索
  const custSheet = getOrCreateSheet("顧客管理");
  const custData = custSheet.getDataRange().getValues();
  
  for (let i = 1; i < custData.length; i++) {
    const cName = normalizeString(custData[i][0]);
    const cTel = normalizePhone(custData[i][1]);
    
    if (cName === name && cTel === tel) {
      const isBlocked = custData[i][3] === true || custData[i][3] === "true" || custData[i][3] === "TRUE";
      const changeCount = parseInt(custData[i][2] || 0, 10);
      
      if (isBlocked || changeCount >= 2) {
        return { isBlocked: true, reason: "度重なる変更による予約制限（顧客管理）" };
      }
    }
  }

  // 2. なりすまし新規予約のすり抜け防止チェック
  const apptSheet = getOrCreateSheet("予約リスト");
  const apptData = apptSheet.getDataRange().getValues();
  const today = new Date();
  today.setHours(0,0,0,0);
  
  for (let i = 1; i < apptData.length; i++) {
    const aName = normalizeString(apptData[i][5]);
    const aTel = normalizePhone(apptData[i][7]);
    const status = String(apptData[i][13] || "");
    const confirmedDateStr = apptData[i][14];
    
    if (aName === name && aTel === tel && (status === "pending" || status === "done")) {
      if (status === "pending") {
        return { isBlocked: true, reason: "すでに送信済みの予約申請が処理中であるため" };
      }
      
      if (status === "done" && confirmedDateStr) {
        const confirmedDate = parseConfirmedDate(confirmedDateStr);
        if (confirmedDate && confirmedDate >= today) {
          return { isBlocked: true, reason: "すでに確定済みの予約が未来に存在するため" };
        }
      }
    }
  }

  return { isBlocked: false, reason: "予約可能" };
}

// ── 各種データ取得・マッピング関数 ──
function getApptsList() {
  const sheet = getOrCreateSheet("予約リスト");
  const data = sheet.getDataRange().getValues();
  const appts = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue; // IDがない空行はスキップ
    
    const choices = [];
    if (row[9]) choices.push(parseChoiceStr(row[9], 1));
    if (row[10]) choices.push(parseChoiceStr(row[10], 2));
    if (row[11]) choices.push(parseChoiceStr(row[11], 3));
    
    const name = normalizeString(row[5] || "");
    const tel = normalizePhone(row[7] || "");
    const blockStatus = getLocalCustomerStatus(name, tel);

    let displayCount = blockStatus.changeCount;
    if (displayCount === 0) {
      displayCount = 1;
    }
    const typeStr = String(row[2] || "");
    const isChangeType = typeStr.includes("変更");
    const isPending = String(row[13] || "") === "pending";
    if (isChangeType && isPending) {
      displayCount += 1;
    }

    // 申請日時の安全なフォーマット
    let receivedStr = "";
    if (row[1] instanceof Date) {
      receivedStr = Utilities.formatDate(row[1], "Asia/Tokyo", "yyyy/MM/dd HH:mm");
    } else {
      receivedStr = String(row[1] || "");
    }

    appts.push({
      id: String(row[0]),
      receivedFull: receivedStr,
      receivedMMDD: extractMMDD(row[1]),
      type: typeStr,
      lineAccount: String(row[3] || ""),
      referral: String(row[4] || ""),
      name: name,
      kana: String(row[6] || ""),
      tel: tel,
      classification: String(row[8] || ""),
      choices: choices.filter(c => c !== null),
      payment: String(row[12] || ""),
      status: String(row[13] || ""),
      confirmedData: row[14] ? { date: String(row[14]), time: String(row[15]), script: String(row[16] || "") } : null,
      displayCount: displayCount,
      isSecondChange: blockStatus.isBlocked || displayCount >= 3
    });
  }
  
  return appts.reverse(); // 最新を上に
}

function getLocalCustomerStatus(name, tel) {
  const sheet = getOrCreateSheet("顧客管理");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (normalizeString(data[i][0]) === name && normalizePhone(data[i][1]) === tel) {
      return {
        changeCount: parseInt(data[i][2] || 0, 10),
        isBlocked: data[i][3] === true || data[i][3] === "true" || data[i][3] === "TRUE"
      };
    }
  }
  return { changeCount: 0, isBlocked: false };
}

function getHolidaysList() {
  const sheet = getOrCreateSheet("不定休カレンダー");
  const data = sheet.getDataRange().getValues();
  const list = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      list.push(formatDateString(data[i][0]));
    }
  }
  return list;
}

function getHolidaysMap() {
  const sheet = getOrCreateSheet("不定休カレンダー");
  const data = sheet.getDataRange().getValues();
  const map = {};
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      const key = formatDateString(data[i][0]);
      map[key] = { memo: data[i][1] || "不定休" };
    }
  }
  return map;
}

function getBookedSlots() {
  const sheet = getOrCreateSheet("予約リスト");
  const data = sheet.getDataRange().getValues();
  const slots = [];
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][13]) === "done" && data[i][14] && data[i][15]) {
      const date = cleanDateStrForSlot(data[i][14]);
      const time = String(data[i][15]);
      slots.push(date + time);
    }
  }
  return slots;
}

// 顧客データ一括取得
function getCustomersList() {
  const sheet = getOrCreateSheet("顧客管理");
  const data = sheet.getDataRange().getValues();
  const list = [];
  for (let i = 1; i < data.length; i++) {
    let lastUpdatedStr = "--";
    if (data[i][4]) {
      lastUpdatedStr = data[i][4] instanceof Date ? Utilities.formatDate(data[i][4], "Asia/Tokyo", "yyyy/MM/dd HH:mm") : String(data[i][4]);
    }
    list.push({
      name: String(data[i][0] || ""),
      tel: String(data[i][1] || ""),
      changeCount: parseInt(data[i][2] || 0, 10),
      isBlocked: data[i][3] === true || data[i][3] === "true" || data[i][3] === "TRUE",
      lastUpdated: lastUpdatedStr
    });
  }
  return list;
}

// ── ユーティリティ関数（正規化・パース等） ──
function normalizeString(str) {
  if (!str) return "";
  return String(str).replace(/\s+/g, "").trim(); // すべてのスペースを削除
}

function normalizePhone(tel) {
  if (!tel) return "";
  let clean = String(tel).replace(/[^\d]/g, ""); // 数字のみ抽出
  // 先頭の「0」を削除して、純粋な市外局番以降の数字のみで比較する
  if (clean.indexOf("0") === 0) {
    clean = clean.substring(1);
  }
  return clean;
}

function formatDateString(dateVal) {
  if (dateVal instanceof Date) {
    return Utilities.formatDate(dateVal, "Asia/Tokyo", "yyyy-MM-dd");
  }
  const str = String(dateVal);
  if (str.includes("T")) return str.split("T")[0];
  return str.trim();
}

function cleanDateStrForSlot(dateStr) {
  if (!dateStr) return "";
  if (dateStr instanceof Date) {
    return Utilities.formatDate(dateStr, "Asia/Tokyo", "yyyy/M/d");
  }
  let clean = String(dateStr).replace(/[\(（][^）\)]*[\)）]/g, "").trim();
  const parts = clean.split(/[\/\-]/);
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    return `${y}/${m}/${d}`;
  }
  return clean;
}

function parseConfirmedDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;
  let clean = String(dateStr).replace(/[\(（][^）\)]*[\)）]/g, "").trim();
  const parts = clean.split(/[\/\-]/);
  if (parts.length === 3) {
    return new Date(parseInt(parts[0],10), parseInt(parts[1],10) - 1, parseInt(parts[2],10));
  }
  if (parts.length === 2) {
    return new Date(new Date().getFullYear(), parseInt(parts[0],10) - 1, parseInt(parts[1],10));
  }
  return null;
}

function parseChoiceStr(choiceStr, priority) {
  if (!choiceStr) return null;
  
  let cleanStr = String(choiceStr);
  cleanStr = cleanStr.replace(/[\(（][^）\)]*[\)）]/g, "").replace(/\s+/g, " ").trim();
  
  const parts = cleanStr.split(" ");
  const date = parts[0] || "";
  const time = parts[1] || "";
  
  let start = 10, end = 20;
  if (time.includes("～") || time.includes("~")) {
    const tParts = time.split(/[～~]/);
    const startHour = parseInt(tParts[0].split(":")[0], 10);
    const endHour = parseInt(tParts[1].split(":")[0], 10);
    if (!isNaN(startHour)) start = startHour;
    if (!isNaN(endHour)) end = endHour;
  } else if (time.includes("午前")) {
    start = 10; end = 12;
  } else if (time.includes("午後")) {
    start = 13; end = 18;
  } else if (time.includes("終日")) {
    start = 10; end = 20;
  }

  return {
    date: date,
    rangeLabel: time || "終日",
    rangeStart: start,
    rangeEnd: end
  };
}

function extractMMDD(dateStr) {
  if (!dateStr) return "0000";
  if (dateStr instanceof Date) {
    return Utilities.formatDate(dateStr, "Asia/Tokyo", "MMdd");
  }
  const str = String(dateStr);
  const match = str.match(/(\d{4})[\/\-](\d{2})[\/\-](\d{2})/);
  if (match) {
    return match[2] + match[3];
  }
  const matchShort = str.match(/(\d{1,2})[\/\-](\d{1,2})/);
  if (matchShort) {
    const m = matchShort[1].padStart(2, '0');
    const d = matchShort[2].padStart(2, '0');
    return m + d;
  }
  return "0000";
}

function outputJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.TEXT);
}

function outputJSONP(data, callback) {
  const jsonStr = JSON.stringify(data);
  const cb = callback || "callback";
  return ContentService.createTextOutput(`${cb}(${jsonStr})`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
