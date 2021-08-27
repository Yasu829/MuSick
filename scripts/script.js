let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let MainPlayer;
let list_flag = false;
let player_flag = false;
function onYouTubeIframeAPIReady() {
  MainPlayer = new YT.Player('MainPlayer',{
    events: {
      "onReady": YTonload
    }
  });
}
function YTonload(){
  player_flag = true;
};
function YTGetBackgroundImage(id, times){
  let YTgetimage = new Image();
  let best_url;
  switch(times){
    case 1:
      best_url = "https://img.youtube.com/vi/" + id + "/default.jpg";
      return best_url;
      break;
      case 2:
        best_url = "https://img.youtube.com/vi/" + id + "/mqdefault.jpg";
        break;
        case 3:
          best_url = "https://img.youtube.com/vi/" + id + "/hqdefault.jpg";
          break;
          case 4:
            best_url = "https://img.youtube.com/vi/" + id + "/sddefault.jpg";
            break;
            case 5:
              best_url = "https://img.youtube.com/vi/" + id + "/maxresdefault.jpg";
              break;
            }
            YTgetimage.onload = function(){
              let wid = YTgetimage.naturalWidth;
              if (wid > 120) {
                $("#Background").css("background-image", "url(" + best_url + ")")
    }
    else{
      times--;
      YTGetBackgroundImage(id, times);
    }
  };
  YTgetimage.src = best_url;
}
let flag = false;
$.getJSON("data/list.json").done(function (json){
  $("#musicup_inner").css("background-color","rgba(255,255,255,0.3)");
  $("#musicup_icon").attr("src", "./images/MusiCup_selected.svg");
  let FolderData;
  let MusicData;
  let flag = false;
  let FolderMap = new Map();
  let i = 0, j = 0;
  let Folders = [];
  let dummy = [];
  let PlainMusic = [];
  let n = 0;
  FolderData = json.folders;
  MusicData = json.musics;
  for(i=0;i<Object.keys([FolderData]).length;i++){
    FolderMap.set(FolderData[i], i);
  }
  for(i=0;i<Object.keys([FolderData]).length;i++){
    Folders.push(dummy);
  }
  for(i=0;i<Object.keys(MusicData).length;i++){
    if(MusicData[i].folder == "" || !FolderMap.has(MusicData[i].folder)){
      PlainMusic.push({name : MusicData[i].name, id: MusicData[i].id});
    }
    else{
      Folders[FolderMap.get(MusicData[i].folder)].push({name : MusicData[i].name, id: MusicData[i].id});
    }
  }
  for(i=0;i<Object.keys(FolderData).length;i++){
  }
  for(i=0;i<PlainMusic.length;i++){
    let el =
    "<li class='content' id='" + PlainMusic[i].id + "'>" +
    "<div class='icon_wrapper'>" +
    "<img class='icon' src='images/ei-music.png'>" +
    "</div>" +
    "<div class='name_wrapper'>"+
    "<p class='name'>"+ PlainMusic[i].name +"</p>"+
    "</div>"+
    "</li>";
    document.getElementById("list").innerHTML += (el);
    n++;
  }
  for(i=0;i<PlainMusic.length;i++){
    $("#" + PlainMusic[i].id).css("background-image", "url(" + "https://img.youtube.com/vi/" + PlainMusic[i].id + "/default.jpg" + ")")
  }
  list_flag = true;
  $('.content').on('click', function() {
    if(!flag){
      $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + $(this).attr("id") + "?controls=0&disablekb=1&modestbranding=1&rel=0&"  + String($("#MainPlayer").attr("src")).substr(31));
      YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
      setTimeout(function(){MainPlayer.playVideo();},1000);
      flag = true;
    }
    else{
      $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + $(this).attr("id") + String($("#MainPlayer").attr("src")).substr(41));
      YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
      setTimeout(function(){MainPlayer.playVideo();},1000);
    }
    $("#MuSick_logo").on("click", function(){
      if(MainPlayer_status == 1) MainPlayer.pauseVideo();
      else if(MainPlayer_status == 2) MainPlayer.playVideo();
      return false;
    });
  });
}).fail(function(){
  alert("jsonファイルの読み込みに失敗しました");
});
let MainPlayer_status = -1;
setInterval( function(){
  if(player_flag){
    let state = MainPlayer.getPlayerState();
    if ( state == YT.PlayerState.ENDED && MainPlayer_status != 0){
      if($(".content").eq(-1).attr("id") == $("#MainPlayer").attr("src").substr(30,11)) {
        $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + $(".content").eq(0).attr("id") + String($("#MainPlayer").attr("src")).substr(41));
        YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
        next = false;
        setTimeout(function(){MainPlayer.playVideo();},1000);
      }
      else {
        $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + $("#" + String($("#MainPlayer").attr("src")).substr(30,11)).next().attr("id") + String($("#MainPlayer").attr("src")).substr(41));
        YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
        next = false;
        setTimeout(function(){MainPlayer.playVideo();},1000);
      }
      MainPlayer_status = 0;
    }
    else if(state == YT.PlayerState.PLAYING && MainPlayer_status != 1){
      MainPlayer_status = 1;
    }
    else if(state == YT.PlayerState.PAUSED && MainPlayer_status != 2){
      MainPlayer_status = 2;
    }
  }
}, 10);