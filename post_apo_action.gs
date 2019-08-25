//カレンダーから予定を取得
function CalendarTrigerPostdata() {
  var calendar = CalendarApp.getCalendarById('メールアドレス');
  // 次のアポ
  var start_time = new Date();
  start_time.setHours(start_time.getHours()-1);//直前のアポを取りたい
  var end_time = new Date();
  end_time.setHours(end_time.getHours());
  var events = calendar.getEvents(start_time, end_time);
  
  if (events != ""){
    return events;
      }
  else {
     return　"予定まったくなし";
  }}

//eventsからアポの予定を取得
function Apodata_parser() {
  var events = CalendarTrigerPostdata() ;
  if (events !== "予定まったくなし"){
    var company_adress_list = [];
    var company_name_list = [];
    var client_name_list = [];
    
    for (var i=0; i < events.length; i++) {
      company_adress_list
      var title = events[i].getTitle(); 
      //.getEvents optionにsearchをセットしてもできる
      if (title.match(/^(?=.*お打ち合わせ).*$/)){
        //タイトルにお打ち合わせが入っていればそれぞれパーサーで抜き出す
        var company_name = Parser.data(title)
                    .from('】')
                    .to('/')
                    .iterate()
        var client_name = Parser.data(title)
                    .from('/')
                    .to('&')
                    .iterate()        
        var guests = events[i].getGuestList();
        //それぞれのリストに格納
        if (guests != ""){
          company_adress_list.push(guests[0].getEmail().match(/@.*$/)[0].replace( "@", "https://www."));
        }
        else {
          company_adress_list.push("不明");
        }
        company_name_list.push(company_name);
        client_name_list.push(client_name);
      }}
      Logger.log(company_adress_list);
      return [company_adress_list, company_name_list, client_name_list];  
    }}

 

function post_slack_message_apo_end(){
    var Data = Apodata_parser();
  if (Data[0].length > 0){
    var company_name_list = Data[1];
    var client_name_list = Data[2];
    var i = company_name_list.length -1; 
    var apo_data = company_name_list[i] + "/" + client_name_list[i] + "さんのアポおつかれ！\n";
   
    var data = {
    "text": apo_data,
    "attachments": [{
      "text": "カレンダーにリマインド予定を設定しますか？",
      "fallback": "fallback message",
      "callback_id": "callback_button",
      "color": "#3AA3E3",
      "attachment_type": "default",
      "actions": [{
          "name": "Calender_set_Yes",
          "text": "Yes",
          "type": "button",
          "value": "Yes"
        },
        {
          "name": "Calender_set_No",
          "text": "No",
          "type": "button",
          "value": "No"
        }
      ]
    }]
  }
  var url = "webhookのURL"
  var options = {
    "method" : "POST",
    "headers": {"Content-type": "application/json"},
    "channel" : "#nakashima-bot",
    "payload" : JSON.stringify(data)
  };
  UrlFetchApp.fetch(url, options);
  }}
