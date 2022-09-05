// 変数たち
let isPlayerAvailable = false;
let list_flag = false;
let flag = false;
// Youtube Player APIセットアップ
let tag = document.createElement('script'); tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0]; firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let MainPlayer;
function onYouTubeIframeAPIReady() {
  MainPlayer = new YT.Player('MainPlayer',{
    events: {
      "onReady": YTonload
    }
  });
}
// [便利関数] Youtube Playerを与えたIDで再生させ始める関数
function MainPlayerStarts(id){
  
}
// [便利関数]　Youtube Playerを与えたIDで曲変する関数
function MainPlayerChange(id){
  
}
// [便利関数]　Youtube Playerで与えたIDの曲を再生する関数
function MainPlayerPlay(id){
  // 未だ嘗て再生されたことがない場合
  if(!flag){
    $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + id + "?playlist=" + id +"&fs=0&loop=!&controls=1&disablekb=1&modestbranding=1&rel=0&"  + String($("#MainPlayer").attr("src")).substr(31));
    flag = true;
  }
  else{
    $("#" + $("#MainPlayer").attr("src").substr(30,11)).removeClass("playing");
    $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + id + "?playlist=" + id + String($("#MainPlayer").attr("src")).substr(62));
  }
  $("#title").html("Playing: " + $("#" + id).text());
  setTimeout(function(){MainPlayer.playVideo();},1000);
  setPlaying();
}
// [便利関数] Youtube Playerの状態をリセットする関数
function MainPlayerReset(){
  $(".playing").removeClass("playing");
  MainPlayer.pauseVideo();
  if(!flag){
    $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + "-----------" + "?playlist=" + "-----------" +"&fs=0&loop=0&controls=1&disablekb=1&modestbranding=1&rel=0&"  + String($("#MainPlayer").attr("src")).substr(31));
    flag = true;
  }
  else{
    $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + "-----------" + "?playlist=" + "-----------" + String($("#MainPlayer").attr("src")).substr(62));
  }
  
  $("#title").html("Playing: ");
}
// [便利関数] 一時停止と再生中を切り替える関数
function switchPausePlay(){
  if(MainPlayer_status == 1){
    $("#" + $("#MainPlayer").attr("src").substr(30,11)).css("animation-play-state", "paused");
    MainPlayer.pauseVideo();
  }
  else if(MainPlayer_status == 2){
    $("#" + $("#MainPlayer").attr("src").substr(30,11)).css("animation-play-state", "running");
    MainPlayer.playVideo();
  }
}
// [便利関数] 与えられたIDの動画のサムネイルを取得する再帰関数。ユーザーはtimesに5を与える
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

// [仕様関数] 曲ブロックを光らせる状態にする関数
function setPlaying(){
  $("#" + $("#MainPlayer").attr("src").substr(30,11)).addClass("playing");
}
// Youtube Player が立ち上がったら実行する関数
function YTonload(){
  isPlayerAvailable = true;
  // スペースかロゴを押したら一時停止と再生を切り替える
  $(window).keydown(function(e){
    if(e.keyCode == 32){
      switchPausePlay();
    }
  });
  $("#MuSick_logo").on("click", function(){
    switchPausePlay()
  });
};



$.getJSON("index.json").done(function(json){
  const DiscData = json;
  let i = 0;
  for(i=0;i<DiscData.length;i++){
    let el = 
    "<li class='disc' id='" + DiscData[i].id + "'>" +
    "<div class='icon_wrapper'>" +
    "<img class='icon' src='images/disc.svg'>" +
    "</div>" +
    "<div class='name_wrapper'>"+
    "<p class='name'>"+ DiscData[i].name +"</p>"+
    "</div>"+
    "</li>";
    document.getElementById("playlists").innerHTML += (el);
  }
  $('.disc').on('click', function() {
    MainPlayerReset();
    if($(this).attr("id") == "local_storage"){
    }
    else{
      readDisc(($(this).attr("id")));
    }
  });
  $("#local_storage").on("dragenter dragover", function(event){
    event.stopPropagation();
    event.preventDefault();
    $("#local_storage").css("background-color", "rgb(220,220,220)");
  });
  $('#local_storage').on('dragleave', function (event) {
    event.stopPropagation();
    event.preventDefault();
    $('#local_storage').css('background-color', '#303030');
  });
  $("#local_storage").on("drop", function(event){
    event.preventDefault();
    $("#input_file")[0].files = event.origit.dataTransfer.files;
    console.log($("#input_file")[0].files);
    if($("#input_file")[0].files.length > 1){
      alert("一つまででお願いします");
      $("#input_file").val("");
      $("#local_storage").css("background-color", "#303030");
      return;
    }
    else if($("#input_file")[0].files[0].type != "application/json"){
      alert("jsonファイルでお願いします")
      $("#local_storage").css("background-color", "#303030");
      return;
    }
    loadFiles($("#input_file")[0].files[0]);
    $("#local_storage").css("background-color", "#303030");
  });
})
function readDisc(url){
  $.getJSON("data/" + url + ".json").done(function (json){
      let J_ = json;
      $("#list").html("");
      for(let i=0;i<J_.musics.length;i++){
        document.getElementById("list").innerHTML += 
        "<li class='content' id='" + J_.musics[i].id + "'>" +
        "<div class='icon_wrapper'>" +
        "<img class='icon' src='images/ei-music.png'>" +
        "</div>" +
        "<div class='name_wrapper'>"+
        "<p class='name'>"+ J_.musics[i].name +"</p>"+
        "</div>"+
        "</li>";
      }
      for(i=0;i<J_.musics.length;i++){
        $("#" + J_.musics[i].id).css("background-image", "url(" + "https://img.youtube.com/vi/" + J_.musics[i].id + "/default.jpg" + ")")
      }
      list_flag = true;
    $('.content').on('click', function() {
      MainPlayerPlay(($(this).attr("id")));
    });
  }).fail(function(){
    alert("jsonファイルの読み込みに失敗しました");
  });
}
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
      MainPlayerStarts();
      // YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
      setPlaying();
      setTimeout(function(){MainPlayer.playVideo();},1000);
      flag = true;
    }
    else{
      MainPlayerChange($(this).attr("id"));
      // YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
      setPlaying();
      setTimeout(function(){MainPlayer.playVideo();},1000);
    }
  });
  }
  fr.readAsText(file);
}
$(function(){
  $("#musicup_inner").css("background-color","rgba(255,255,255,0.3)");
  $("#musicup_inner").on("click",function(){
    $("#musicup_inner").css("background-color","rgba(255,255,255,0.3)");
    $("#lobby_inner").css("background-color","");
    $("#list_wrapper").css("display","block");
    $("#playlists_wrapper").css("display","none");
  });
  $("#lobby_inner").on("click", function(){
    $("#musicup_inner").css("background-color","");
    $("#lobby_inner").css("background-color","rgba(255,255,255,0.3)");
    $("#list_wrapper").css("display","none");
    $("#playlists_wrapper").css("display","block");
  });
});
function changed(file){
  console.log(file.files[0]);
  if(file.files.length > 1){
    alert("一つまででお願いします");
    $("#input_file").val("");
    $("#local_storage").css("background-color", "#303030");
    return;
  }
  else if(file.files[0].type != "application/json"){
    alert("jsonファイルでお願いします")
    $("#local_storage").css("background-color", "#303030");
    return;
  }
  console.log(file.files[0]);
  loadFiles(file.files[0]);
  $("#local_storage").css("background-color", "#303030");
}
let MainPlayer_status = -1;
let related_flag = false;
setInterval( function(){
  if(isPlayerAvailable){
    let state = MainPlayer.getPlayerState();
    if ( state == YT.PlayerState.ENDED && MainPlayer_status != 0){
      if($(".content").eq(-1).attr("id") == $("#MainPlayer").attr("src").substr(30,11)) {
        $("#" + $("#MainPlayer").attr("src").substr(30,11)).removeClass("playing");
        MainPlayerChange($(".content").eq(0).attr("id"))
        // YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
        setPlaying();
        next = false;
        setTimeout(function(){MainPlayer.playVideo();},1000);
      }
      else {
        $("#" + $("#MainPlayer").attr("src").substr(30,11)).removeClass("playing");
        MainPlayerChange($("#" + String($("#MainPlayer").attr("src")).substr(30,11)).next().attr("id"));
        // YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
        setPlaying();
        next = false;
        setTimeout(function(){MainPlayer.playVideo();},1000);
      }
      MainPlayer_status = 0;
    }
    else if(state == YT.PlayerState.PLAYING && MainPlayer_status != 1){
      flag = true;
      MainPlayer_status = 1;
    }
    else if(state == YT.PlayerState.PAUSED && MainPlayer_status != 2){
      MainPlayer_status = 2;
    }
  }
}, 10);
