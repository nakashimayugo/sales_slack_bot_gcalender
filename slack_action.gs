function doPost(e) {
  var payload = JSON.parse(e["parameter"]["payload"]);
  var value = payload["actions"][0]["value"];
  
  //事前準備ア「Question_sheet」のアクション
  if (value == "Question_sheet") {    
    debuck_spredsheet(value);
    var set_company_and_name = unescape(payload["original_message"]["text"]).replace("さんのアポ楽しんでいこー！\n","");
    var set_text = "--------------------------------------------------\n■社名・名前\n" + set_company_and_name + "\n\n■知ったきっかけ\n\n■担当領域、決済者\n\n■既存利用サービスと結果\n\n■採用計画\n\n■採用人材像\n\n■懸念点\n\n■その他\n\n--------------------------------------------------";
    var reply = {
      "replace_original": false,
      "response_type": "in_channel",
      "text": set_text,
    };
  }
  
  //事前準備ア「Activity_search」のアクション
  if (value == "Activity_search") {
    debuck_spredsheet(value);
    var set_companyname = unescape(payload["original_message"]["text"]).replace(/\u002f.*/,"").replace("\n","");
    
    var reply = {
      "replace_original": false,
      "response_type": "in_channel",
      "text": set_companyname + "の採用活動を調べます。こちらをクリックしてください。\n\n" + "https://demo-hrsearch.herokuapp.com/?csrfmiddlewaretoken=pURw2ppQvOIItg6ezaJAJP4eTxQw5QMVWS6aJYzbHPJglZH5ZC4KlvHpaaLkUzso&company_name=" + set_companyname,
    };
  }
  
  //事後アンケート「Yes」のアクション
  if (value == "Yes") {    
    debuck_spredsheet(value);
    var set_title = unescape(payload["original_message"]["text"]).replace("のアポおつかれ！","");
    createEvents(set_title)//登録関数を呼び出し
    var reply = {
      "replace_original": false,
      "response_type": "in_channel",
      "text": "カレンダーにリマインド予定を登録しました"
    };
  }
  //事後アンケート「No」のアクション
  if (value == "No") {
    debuck_spredsheet(value);
    var reply = {
      "replace_original": false,
      "response_type": "in_channel",
      "text": value + "ですね。HubSpotに理由を記録しましょう。"
    };
  }
  
  var output = ContentService.createTextOutput(JSON.stringify(reply));
  output.setMimeType(ContentService.MimeType.JSON);
  return output
}



//slackのpostを受け取り、カレンダーにリマインド日を登録する関数を定義
function createEvents(set_title, set_day) {
  var calendar = CalendarApp.getDefaultCalendar();
  var title = "【リマインド連絡】" +　set_title;
  var start_day = new Date();
  start_day.setDate(start_day.getDate() + 7);//1週間後をセット
  var end_day = new Date();
  end_day.setDate(start_day.getDate()+ 3);//3日間リマインドを表示させたい
  var option = {
    description: '〇〇',
    location: '■■'
  }
  
  calendar.createAllDayEvent(title, start_day, end_day, option);
}

//エラー確認用
function debuck_spredsheet(value) {
  var spreadsheet = SpreadsheetApp.openById("シートID");
  var sheet = spreadsheet.getSheetByName("出力用");
  sheet.appendRow([new Date(),value + "までは来てる"]);
}
