let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let MainPlayer;
let list_flag = false;
let player_flag = false;
let flag = false;

function onYouTubeIframeAPIReady() {
  MainPlayer = new YT.Player('MainPlayer',{
    events: {
      "onReady": YTonload
    }
  });
}
function hi() {
  $("iframe").contents().find("html").contents().find("body").on("click", function(e){
    alert("タップされた");
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
function MainPlayerReset(){
  $(".playing").removeClass("playing");
  MainPlayer.pauseVideo();
  if(!flag){
    $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + "-----------" + "?playlist=" + "-----------" +"&fs=0&loop=!&controls=1&disablekb=1&modestbranding=1&rel=0&"  + String($("#MainPlayer").attr("src")).substr(31));
    flag = true;
  }
  else{
    $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + "-----------" + "?playlist=" + "-----------" + String($("#MainPlayer").attr("src")).substr(62));
  }
  $("#title").html("Playing: ");
}

function MainPlayerStarts(id){
  $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + id + "?playlist=" + id +"&fs=0&loop=!&controls=1&disablekb=1&modestbranding=1&rel=0&"  + String($("#MainPlayer").attr("src")).substr(31));
  $("#title").html("Playing: " + $("#" + id).text());
  // $("#playing_icon").css("background-image", "url(" + "https://img.youtube.com/vi/" + id + "/default.jpg" + ")")
}
function MainPlayerChange(id){
  $("#MainPlayer").attr("src", "https://www.youtube.com/embed/" + id + "?playlist=" + id + String($("#MainPlayer").attr("src")).substr(62));
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
      if(!flag){
        MainPlayerStarts(($(this).attr("id")));
        // YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
        setPlaying();
        setTimeout(function(){MainPlayer.playVideo();},1000);
        flag = true;
      }
      else{
        $("#" + $("#MainPlayer").attr("src").substr(30,11)).removeClass("playing");
        MainPlayerChange($(this).attr("id"));
        // YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
        setPlaying();
        setTimeout(function(){MainPlayer.playVideo();},1000);
      }
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
      MainPlayerStarts(($(this).attr("id")));
      // YTGetBackgroundImage(String($("#MainPlayer").attr("src")).substr(30,11), 5);
      setPlaying();
      setTimeout(function(){MainPlayer.playVideo();},1000);
      flag = true;
    }
    else{
      $("#" + $("#MainPlayer").attr("src").substr(30,11)).removeClass("playing");
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
  })
  $("#lobby_inner").on("click", function(){
    $("#musicup_inner").css("background-color","");
    $("#lobby_inner").css("background-color","rgba(255,255,255,0.3)");
    $("#list_wrapper").css("display","none");
    $("#playlists_wrapper").css("display","block");
  })
});
let MainPlayer_status = -1;
let related_flag = false;
setInterval( function(){
  if(player_flag){
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