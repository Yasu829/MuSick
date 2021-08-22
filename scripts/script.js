//"use strict";

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
    alert($(this).attr("id"));
  });
}).fail(function(){
  alert("jsonファイルの読み込みに失敗しました");
});
