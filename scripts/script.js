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
  $(window).keydown(function(e){
    if(e.keyCode == 32){
      if(MainPlayer_status == 1){
        $("#" + $("#MainPlayer").attr("src").substr(30,11)).css("animation-play-state", "paused");
        MainPlayer.pauseVideo();
      }
      else if(MainPlayer_status == 2){
        $("#" + $("#MainPlayer").attr("src").substr(30,11)).css("animation-play-state", "running");
        MainPlayer.playVideo();
      }
    }
  });
  $("#MuSick_logo").on("click", function(){
    if(MainPlayer_status == 1){
      $("#" + $("#MainPlayer").attr("src").substr(30,11)).css("animation-play-state", "paused");
      MainPlayer.pauseVideo();
    }
    else if(MainPlayer_status == 2){
      $("#" + $("#MainPlayer").attr("src").substr(30,11)).css("animation-play-state", "running");
      MainPlayer.playVideo();
    }
    return false;
  });
};
function setPlaying(){
  $("#" + $("#MainPlayer").attr("src").substr(30,11)).addClass("playing");
}
function MainPlayerStarts(id){
  $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + id + "?controls=0&disablekb=1&modestbranding=1&rel=0&"  + String($("#MainPlayer").attr("src")).substr(31));
  $("#title").html("Playing: " + $("#" + id).text());
  // $("#playing_icon").css("background-image", "url(" + "https://img.youtube.com/vi/" + id + "/default.jpg" + ")")
}
function MainPlayerChange(id){
  $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + id + String($("#MainPlayer").attr("src")).substr(41));
  $("#title").html("Playing: " + $("#" + id).text());
  // $("#playing_icon").css("background-image", "url(" + "https://img.youtube.com/vi/" + id + "/default.jpg" + ")")
}
function YTGetBackgroundImage(id, times){
  let YTgetimage = new Image();
  let best_url;
  switch(times){
    case 1:
      best_url = "https://img.youtube.com/vi/" + id + "/default.jpg";
      return best_url;
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
      MainPlayerStarts(($(this).attr("id")));
      YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
      setPlaying();
      setTimeout(function(){MainPlayer.playVideo();},1000);
      flag = true;
    }
    else{
      $("#" + $("#MainPlayer").attr("src").substr(30,11)).removeClass("playing");
      MainPlayerChange($(this).attr("id"));
      YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
      setPlaying();
      setTimeout(function(){MainPlayer.playVideo();},1000);
    }
  });
}).fail(function(){
  alert("jsonファイルの読み込みに失敗しました");
});
function loadFiles(file){
  let fr = new FileReader();
  fr.onload = function(event){
    let jeison = JSON.parse(event.target.result);
    $("#list").html("");
    for(let i=0;i<jeison.musics.length;i++){
      document.getElementById("list").innerHTML += 
      "<li class='content' id='" + jeison.musics[i].id + "'>" +
      "<div class='icon_wrapper'>" +
      "<img class='icon' src='images/ei-music.png'>" +
      "</div>" +
      "<div class='name_wrapper'>"+
      "<p class='name'>"+ jeison.musics[i].name +"</p>"+
      "</div>"+
      "</li>";
    }
    for(i=0;i<jeison.musics.length;i++){
      $("#" + jeison.musics[i].id).css("background-image", "url(" + "https://img.youtube.com/vi/" + jeison.musics[i].id + "/default.jpg" + ")")
    }
    list_flag = true;
  $('.content').on('click', function() {
    if(!flag){
      MainPlayerStarts(($(this).attr("id")));
      YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
      setPlaying();
      setTimeout(function(){MainPlayer.playVideo();},1000);
      flag = true;
    }
    else{
      $("#" + $("#MainPlayer").attr("src").substr(30,11)).removeClass("playing");
      MainPlayerChange($(this).attr("id"));
      YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
      setPlaying();
      setTimeout(function(){MainPlayer.playVideo();},1000);
    }
  });
  }
  fr.readAsText(file);
}
$(function(){
  $("#MuSick_logo").on("dragenter dragover", function(event){
    event.stopPropagation();
    event.preventDefault();
    $("#MuSick_logo").css("background-color", "rgb(200,200,200)");
  });
  $('#MuSick_logo').on('dragleave', function (event) {
    event.stopPropagation();
    event.preventDefault();
    $('#MuSick_logo').css('background-color', '#242424');
  });
  $("#MuSick_logo").on("drop", function(event){
    event.preventDefault();
    $("#input_file")[0].files = event.originalEvent.dataTransfer.files;
    console.log($("#input_file")[0].files);
    if($("#input_file")[0].files.length > 1){
      alert("一つまででお願いします");
      $("#input_file").val("");
      $("#MuSick_logo").css("background-color", "#242424");
      return;
    }
    else if($("#input_file")[0].files[0].type != "application/json"){
      alert("jsonファイルでお願いします")
      $("#MuSick_logo").css("background-color", "#242424");
      return;
    }
    loadFiles($("#input_file")[0].files[0]);
    $("#MuSick_logo").css("background-color", "#242424");
  });
  $("file").on("change", function(){
    if(this.files.length > 1){
      alert("一つまででお願いします");
      $("#input_file").val("");
      $("#MuSick_logo").css("background-color", "#242424");
      return;
    }
    else if($("#input_file")[0].files[0].type != "application/json"){
      alert("jsonファイルでお願いします")
      $("#MuSick_logo").css("background-color", "#242424");
      return;
    }
    loadFiles($("#input_file")[0].files[0]);
    $("#MuSick_logo").css("background-color", "#242424");
  });
});
let MainPlayer_status = -1;
setInterval( function(){
  if(player_flag){
    let state = MainPlayer.getPlayerState();
    if ( state == YT.PlayerState.ENDED && MainPlayer_status != 0){
      if($(".content").eq(-1).attr("id") == $("#MainPlayer").attr("src").substr(30,11)) {
        $("#" + $("#MainPlayer").attr("src").substr(30,11)).removeClass("playing");
        MainPlayerChange($(".content").eq(0).attr("id"))
        YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
        setPlaying();
        next = false;
        setTimeout(function(){MainPlayer.playVideo();},1000);
      }
      else {
        $("#" + $("#MainPlayer").attr("src").substr(30,11)).removeClass("playing");
        MainPlayerChange($("#" + String($("#MainPlayer").attr("src")).substr(30,11)).next().attr("id"));
        YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
        setPlaying();
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