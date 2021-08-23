//"use strict";
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player',{
    events: {
    }
  });
}
let flag = false;
let next = false;
// function onPlayerStateChange(event){
//   console.log("play");
//   if(event.data == YT.PlayerState.PLAYING){
//     console.log("play");
//     next = true;
//   }
//   if(event.data == YT.PlayerState.ENDED && next){
//     console.log("if");
//     setTimeout(function(){next = true;}, 1000);
//     if($("#list li:last") == $("#" + $(this).attr("id"))) {
//       $("#player").attr("src", "https://www.youtube.com/embed/" + $("#list li:first").attr("id")  /* + "?loop=1&playlist="  + $(this).attr("id") */ + String($("#player").attr("src")).substr(69));
//       setTimeout(function(){event.target.playVideo();},1000);
//     }
//     else {
//       console.log("else");
//       $("#player").attr("src", "https://www.youtube.com/embed/" + $("#" + $(this).attr("id")).next().attr("id")  /* + "?loop=1&playlist="  + $(this).attr("id") */ + String($("#player").attr("src")).substr(41));
//       setTimeout(function(){event.target.playVideo();},1000);
//     }
//     next = false;
//   }
// }
$.getJSON("data/list.json").done(function (json){
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
      document.getElementById("list").innerHTML += el;
      document.getElementById("list").innerHTML;
      n++;
  }
  $('.content').on('click', function() {
    if(!flag){
      $("#player").attr("src", "https://www.youtube.com/embed/" + $(this).attr("id") + /* "?loop=1&playlist=" + $(this).attr("id") */ "?controls=0&disablekb=1&modestbranding=1&rel=0&"  + String($("#player").attr("src")).substr(/*69*/31));
      setTimeout(function(){player.playVideo();},1000);
      flag = true;
    }
    else{
      $("#player").attr("src", "https://www.youtube.com/embed/" + $(this).attr("id")  /* + "?loop=1&playlist="  + $(this).attr("id") */ + String($("#player").attr("src")).substr(41));
      setTimeout(function(){player.playVideo();},1000);
    }
    $("#control_top").on("click", function(){
        if(player.getPlayerState() == 1) player.stopVideo();
        return false;
    });
  });
}).fail(function(){
  alert("jsonファイルの読み込みに失敗しました");
});
setInterval( function(){ let state = player.getPlayerState();  if ( state == YT.PlayerState.ENDED && next)
  {
    console.log("yes"); 
    if($("#list li:last") == $("#" + $(this).attr("id"))) {
      $("#player").attr("src", "https://www.youtube.com/embed/" + $("#list li:first").attr("id")  /* + "?loop=1&playlist="  + $(this).attr("id") */ + String($("#player").attr("src")).substr(41));
      next = false;
      setTimeout(function(){player.playVideo();},1000);
    }
    else {
      console.log(String($("#player").attr("src")).substr(30,11));
      $("#player").attr("src", "https://www.youtube.com/embed/" + $("#" + String($("#player").attr("src")).substr(30,11)).next().attr("id")  /* + "?loop=1&playlist="  + $(this).attr("id") */ + String($("#player").attr("src")).substr(41));
      next = false;
      setTimeout(function(){player.playVideo();},1000);
    }
  }
  else if(state == YT.PlayerState.PLAYING){
    console.log("playing");
    next = true;
  }
}, 100);