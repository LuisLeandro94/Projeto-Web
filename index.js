function programarCarregamentoTexto() {
  $('.dots').on('click',function(){
    $(this).closest("h6").find(".more").show();
    $(this).closest(".card").css('height','auto');
    $(this).hide();
  });

  $('.textArrow').on('click',function(){
    $(this).closest("h6").find(".more").hide();
    $(this).closest(".card").css('height','auto');
    $(this).closest("h6").find(".dots").show();
  });
};

function procura() {
  var link =
    "https://api.unsplash.com/photos/?client_id=60R9shKlaRd74MMgoYq1Qy6cOzgz9R8tyKifF7zXhlw&language=en-US&per_page=24&order_by=latest&page=";
  var linkPaged = link + page;
  $.ajax({
    url: linkPaged,
    type: "get",
    async: true,
    success: function (data) {
      adicionarFotos(data);
      resize();
      programarCarregamentoTexto();
    },
  });
}

function getCount() {
  var count = 0;
  var link =
    "https://api.unsplash.com/stats/total?client_id=60R9shKlaRd74MMgoYq1Qy6cOzgz9R8tyKifF7zXhlw";
  $.ajax({
    url: link,
    type: "get",
    async: false,
    success: function (data) {
      count = data.total_photos / 24;
    },
  });
  return count;
}

function adicionarFotos(dataResposta) {
  $("#contentorFotos").empty();
  console.log(dataResposta);

  var len = dataResposta.length;

  for (var i = 0; i < len; i++) {
    var foto = dataResposta[i];
    criarFoto(foto);
  }
}

function adicionarFotosBySeacrh(dataResposta) {
  $("#contentorFotos").empty();

  var len = dataResposta.results.length;

  if(len != 0)
  {
    for (var i = 0; i < len; i++) {
      var foto = dataResposta.results[i];
        criarFoto(foto);
    }
  }
  else
  {
    noResults(foto);
    $("#anterior").closest("li").addClass("hide");
    $("#seguinte").closest("li").addClass("hide");
  }
}

function noResults(foto) {
  //criar h1
  var h3 = document.createElement("h3");
  h3.innerText = "Nothing to show here :/";
  //criar 0
  var h1 = document.createElement("p");
  h1.className = "center-txt sizing";
  h1.innerText = "0";
  //criar h2
  var h4 = document.createElement("h4");
  h4.innerText = "results";
  h4.className = "center-txt";
  // criar div pai
  var firstDiv = document.createElement("div");

  var divPrincipal = document.createElement("div");
  // adicionar filhos à div pai
  firstDiv.appendChild(divPrincipal);

  divPrincipal.appendChild(h3);
  divPrincipal.appendChild(h1);
  divPrincipal.appendChild(h4);
  // adicionar div pai à pagina/DOM

  var container = document.getElementById("contentorFotos");
  container.className = "container-error";
  container.appendChild(firstDiv);
}

function criarFoto(foto) {
  // criar imagem
  var download = document.createElement("i");
  download.className = "fa fa-download";

  // criar botao
  var buttonD = document.createElement("a");
  buttonD.className = "btn btn-secondary pull-right downloadBtn";
  buttonD.setAttribute("href", foto.urls.regular);
  buttonD.setAttribute("target", "_blank");
  buttonD.appendChild(download);

  // criar h5
  var h5 = document.createElement("h5");
  h5.className = "card-title";
  h5.innerText = foto.user.name;

  // criar h6
  var h6 = document.createElement("h6");
  h6.className = "card-description";

  if (foto.description != "" && foto.description != undefined) {
    if (foto.description.length > 64) {
      h6.innerText = foto.description.substr(0, 64);

      var spanDots = document.createElement("span");
      spanDots.className = "dots";
      spanDots.innerText = " ...";

      var iconArrow = document.createElement("i");
      iconArrow.className = "fa fa-arrow-up textArrow";

      var spanMore = document.createElement("span");
      spanMore.className = "more";
      spanMore.innerText = foto.description.substr(64, foto.description.length);
      spanMore.appendChild(iconArrow);
      h6.appendChild(spanDots);
      h6.appendChild(spanMore);
    } else {
      h6.innerText = foto.description;
    }
  }

  // criar div filha
  var div = document.createElement("div");
  div.className = "card-body";
  div.appendChild(h5);
  div.appendChild(h6);
  div.appendChild(buttonD);

  // criar img
  var img = document.createElement("img");
  img.className = "card-img-top";
  var imgSrc = foto.urls.raw + "&fit=crop&w=500&h=500";
  img.setAttribute("src", imgSrc);
  // criar div pai
  var firstDiv = document.createElement("div");
  firstDiv.className = "col-lg-3 col-md-4 col-sm-5 ";

  var divPrincipal = document.createElement("div");
  divPrincipal.className = "card";
  divPrincipal.id = "";
  // adicionar filhos à div pai
  firstDiv.appendChild(divPrincipal);

  divPrincipal.appendChild(img);
  divPrincipal.appendChild(div);
  // adicionar div pai à pagina/DOM

  var container = document.getElementById("contentorFotos");
  container.className = "row";
  container.appendChild(firstDiv);
}

function programarCarregamentoPagina() {
  $(window).on("load", procura);
}

function anterior() {
  if (page == 1) {
    page = 1;
  } else {
    var c = getCount();
    page = page - 1;
    if(page < c)
    {
      $("#seguinte").closest("li").removeClass("disabled");
    }
    if (page == 1) {
      $("#anterior").closest("li").addClass("disabled");
    }
  }
  procura();
}

function seguinte() {
  var c = getCount();
  page = page+1;

  debugger;
  if(page == c)
  {
    $("#seguinte").closest("li").addClass("disabled");
  }
  else {
    $("#anterior").closest("li").removeClass("disabled");
    procura();}
}

function programarBotoesPaginacao() {
  var botaoAnterior = document.getElementById("anterior");
  var botaoSeguinte = document.getElementById("seguinte");

  botaoAnterior.addEventListener("click", anterior);
  botaoSeguinte.addEventListener("click", seguinte);
}

function programarBotaoSearch() {
  var botaoSearch = document.getElementById("search-button");

  botaoSearch.addEventListener("click", procuraSearch);
}

function procuraSearch(event) {
  event.preventDefault();
  var search = $("#search-input").val();
  debugger;
  if (search == "" || search == undefined) {
    $("#Modal").modal("show");
  } else {
    var url =
      "https://api.unsplash.com/search/photos?query=" +
      search +
      "&per_page=24&client_id=60R9shKlaRd74MMgoYq1Qy6cOzgz9R8tyKifF7zXhlw";
    $.ajax({
      url: url,
      type: "GET",
      async: true,
      success: function (data) {
        adicionarFotosBySeacrh(data);
        resize();
        programarCarregamentoTexto();
      },
    });
  }
}

$('.search-button').on('click', function(event) { // Fired on 'keyup' event

  if($('.details-card').children().length === 0) { // Checking if list is empty

    $('.not-found').css('display', 'block'); // Display the Not Found message

  } else {

    $('.not-found').css('display', 'none'); // Hide the Not Found message

  }
});

function resize() {
  var h = 0;
  var nmrRead = 0;
  var j = 0;
  $(".card").each(function () {
    ++nmrRead;
    ++j;
    if (h < $(this).height()) {
      h = $(this).height();
    }
    if (nmrRead == 4) {
      for (i = 4; i > 0; i--) {
        var x = $(".card")[j - i];
        $(x).css("height", h + 304);
      }
      nmrRead = 0;
      h = 0;
    }
  });
}

var popover = new bootstrap.Popover(document.querySelector('.navbar-brand'), {
  container: 'body'
})

programarCarregamentoPagina();
programarBotoesPaginacao();
programarBotaoSearch();


$(document).ready(function(){
  $("#modal-button").click(function(){
      $("#Modal").modal('hide');
  });
  $("#close").click(function() {
    $("#Modal").modal('hide');
  });
})

var page = 1;