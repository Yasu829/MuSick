let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let MainPlayer;
function onYouTubeIframeAPIReady() {
  MainPlayer = new YT.Player('MainPlayer',{
    events: {
    }
  });
}

function YTGetBackgroundImage(id, times){
  let return_url;
  switch(times){
    case 1:
      return_url = "https://img.youtube.com/vi/" + id + "/default.jpg"
      return return_url;
    case 2:
      return_url = "https://img.youtube.com/vi/" + id + "/maxresdefault.jpg"
      break;
    case 3:
      return_url = "https://img.youtube.com/vi/" + id + "/maxresdefault.jpg"
      break;
    case 4:
      return_url = "https://img.youtube.com/vi/" + id + "/maxresdefault.jpg"
      break;
    case 5:
      return_url = "https://img.youtube.com/vi/" + id + "/maxresdefault.jpg"
      break;
  }
  let YTgetimage = new Image();
  YTgetimage.crossOrigin = 'anonymous';
  YTgetimage.onload = function(){
    if (YTgetimage.naturalWidth > 120) {
      return return_url;
    }
    else {
      return YTGetBackgroundImage(id, times-1);
    }
  };
  YTgetimage.src = return_url;
}
let flag = false;
let next = false;
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
  $('.content').on('click', function() {
    if(!flag){
      $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + $(this).attr("id") + "?controls=0&disablekb=1&modestbranding=1&rel=0&"  + String($("#MainPlayer").attr("src")).substr(31));
      $("#player_wrap").css("background-image", "url(" + YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5) + ")");
      setTimeout(function(){MainPlayer.playVideo();},1000);
      flag = true;
    }
    else{
      $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + $(this).attr("id") + String($("#MainPlayer").attr("src")).substr(41));
      $("#player_wrap").css("background-image", "url(" + YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5) + ")");
      setTimeout(function(){MainPlayer.playVideo();},1000);
    }
    $("#MuSick_logo").on("click", function(){
      if(MainPlayer.getPlayerState() == 1) MainPlayer.stopVideo();
      return false;
    });
  });
}).fail(function(){
  alert("jsonファイルの読み込みに失敗しました");
});
setInterval( function(){ let state = MainPlayer.getPlayerState();  if ( state == YT.PlayerState.ENDED && next)
  {
    if($(".content").eq(-1).attr("id") == $("#MainPlayer").attr("src").substr(30,11)) {
      console.log("YYYYYESSS");
      $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + $(".content").eq(0).attr("id") + String($("#MainPlayer").attr("src")).substr(41));
      $("#player_wrap").css("background-image", "url(" + YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5) + ")");
      next = false;
      setTimeout(function(){MainPlayer.playVideo();},1000);
    }
    else {
      console.log("NNOOOOOOOO");
      $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + $("#" + String($("#MainPlayer").attr("src")).substr(30,11)).next().attr("id") + String($("#MainPlayer").attr("src")).substr(41));
      $("#player_wrap").css("background-image", "url(" + YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5)  + ")");
      next = false;
      setTimeout(function(){MainPlayer.playVideo();},1000);
    }
  }
  else if(state == YT.PlayerState.PLAYING && !next){
    next = true;
  }
}, 1000);