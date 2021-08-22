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
  player = new YT.Player('player',{});
}
let flag = false;
$.getJSON("data/list.json").done(function (json){
  console.log(json);
  const FolderData = json.folders;
  const MusicData = json.musics;
  let FolderMap = new Map();
  let i = 0, j = 0;
  for(i=0;i<Object.keys([FolderData]).length;i++){
    FolderMap.set(FolderData[i], i);
  }
  let Folders = [];
  let dummy = [];
  for(i=0;i<Object.keys([FolderData]).length;i++){
    Folders.push(dummy);
  }
  let PlainMusic = [];
  for(i=0;i<Object.keys(MusicData).length;i++){
    if(MusicData[i].folder == "" || !FolderMap.has(MusicData[i].folder)){
      PlainMusic.push({name : MusicData[i].name, id: MusicData[i].id});
    }
    else{
      Folders[FolderMap.get(MusicData[i].folder)].push({name : MusicData[i].name, id: MusicData[i].id});
    }
  }
  const list = document.getElementById("list");
  let n = 0;
  for(i=0;i<Object.keys(FolderData).length;i++){
  }
  for(i=0;i<PlainMusic.length;i++){
    let el = 
    "<label>" +
        "<li class='content' id='" + PlainMusic[i].id + "'>" +
          "<div class='icon_wrapper'>" +
            "<img class='icon' src='images/ei-music.png'>" +
          "</div>" +
          "<div class='name_wrapper'>"+
            "<p class='name'>"+ PlainMusic[i].name +"</p>"+
          "</div>"+
        "</li>"+
      "</label>";
    console.log(el);
    list.innerHTML += el;
    n++;
  }
  $('.content').on('click', function() {
    if(!flag){
      $("#player").attr("src", "https://www.youtube.com/embed/" + $(this).attr("id") + "?loop=1&playlist=" + $(this).attr("id") +"&controls=0&disablekb=1&modestbranding=1&rel=0&"  + String($("#player").attr("src")).substr(31));
      flag = true;
    }
    else{
      $("#player").attr("src", "https://www.youtube.com/embed/" + $(this).attr("id") + String($("#player").attr("src")).substr(41));
    }
    $("#control_top").on("click", function(){
        console.log("yes");
        player.playVideo();
        return false;
    });
  });
}).fail(function(){
  alert("jsonファイルの読み込みに失敗しました");
});
